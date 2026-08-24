'use strict';

/**
 * livery_codec.js
 *
 * FORMAT SUMMARY:
 *   Stream = [version:1 byte][total_node_count:uint16 LE]
 *            [root record: 18 bytes][top_level_count:uint16 LE]
 *            [top-level records, recursively...]
 *
 *   Each 18-byte record:
 *     id, x, y, w, h, rot -> six uint16 fields, each stored little-endian
 *     color               -> 4 raw bytes (R,G,B,A), no byte-swap
 *     byteA, byteB        -> two independent 1-byte fields, no byte-swap
 *
 *   A record has children IF AND ONLY IF its id field === 0xFFFF.
 *   0xFFFF is a reserved "container" id, never used by a real leaf sticker type
 *   (verified with zero exceptions across the full known dataset).
 *   When id === 0xFFFF, the next 2 bytes (uint16 LE) are the child count,
 *   followed by that many child records (each recursively the same structure).
 */

const ROOT_RECORD_HEX = 'FFFF00000000006400640000FFFFFFFF0001';

function hexToRecordBytes(hexstr) {
  if (hexstr.length !== 36) {
    throw new Error(`Record must be 18 bytes (36 hex chars), got ${hexstr.length}: ${hexstr}`);
  }
  const b = Buffer.from(hexstr, 'hex');
  const out = Buffer.alloc(18);
  let o = 0;
  for (let i = 0; i < 12; i += 2) {
    out[o++] = b[i + 1]; // little-endian swap
    out[o++] = b[i];
  }
  b.copy(out, o, 12, 16); // color - raw
  o += 4;
  out[o++] = b[16]; // byteA - raw
  out[o++] = b[17]; // byteB - raw
  return out;
}

function recordBytesToHex(rb) {
  if (rb.length !== 18) throw new Error(`Expected 18 bytes, got ${rb.length}`);
  const out = Buffer.alloc(18);
  let o = 0;
  for (let i = 0; i < 12; i += 2) {
    out[o++] = rb[i + 1]; // swap back
    out[o++] = rb[i];
  }
  rb.copy(out, o, 12, 16);
  o += 4;
  out[o++] = rb[16];
  out[o++] = rb[17];
  return out.toString('hex').toUpperCase();
}

function parseTreeText(text) {
  const lines = text
    .split(/\r?\n/)
    .map((l) => {
      l = l.trim();

      if (l === '<' || l === '>') {
        return l;
      }
      return l.replace(/\s+/g, '').toUpperCase();
    })
    .filter((l) => l !== '');

  let pos = 0;

  function parseLevel() {
    const nodes = [];

    while (pos < lines.length) {

      const line = lines[pos];

      if (line === '>') {
        pos++;
        return nodes;

      } else if (line === '<') {

        pos++;

        if (nodes.length === 0) {
          throw new Error("Child block found without parent record.");
        }

        const children = parseLevel();
        nodes[nodes.length - 1].children = children;

      } else {

        nodes.push({
          rec: line,
          children: null
        });

        pos++;
      }
    }

    return nodes;
  }

  return parseLevel();
}

function countNodes(nodes) {
  let c = 0;
  for (const node of nodes) {
    c += 1;
    if (node.children) c += countNodes(node.children);
  }
  return c;
}

function serializeNodes(nodes) {
  const chunks = [];
  for (const node of nodes) {
    chunks.push(hexToRecordBytes(node.rec));
    if (node.children !== null) {
      const n = node.children.length;
      const countBuf = Buffer.alloc(2);
      countBuf.writeUInt16LE(n, 0);
      chunks.push(countBuf);
      chunks.push(serializeNodes(node.children));
    }
  }
  return Buffer.concat(chunks);
}

/**
 * Encode hex/bracket tree text into a raw binary Buffer.
 * includeImplicitRoot=true matches the pattern seen in real save files,
 * where the top-level list of records sits inside one implicit root node.
 * The header's total_node_count field counts only the visible tree nodes
 * (does NOT include the implicit root itself) - verified byte-for-byte.
 */

function encode(text, { version = 2, includeImplicitRoot = true } = {}) {
  const tree = parseTreeText(text);
  const totalNodes = countNodes(tree);

  const header = Buffer.alloc(3);
  header[0] = version;
  header.writeUInt16LE(totalNodes, 1);

  let body;
  if (includeImplicitRoot) {
    const rootBuf = hexToRecordBytes(ROOT_RECORD_HEX);
    const topCountBuf = Buffer.alloc(2);
    topCountBuf.writeUInt16LE(tree.length, 0);
    body = Buffer.concat([rootBuf, topCountBuf, serializeNodes(tree)]);
  } else {
    body = serializeNodes(tree);
  }

  return Buffer.concat([header, body]);
}

function deserializeNodes(data, pos, count) {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    const rb = data.subarray(pos, pos + 18);
    pos += 18;
    const hexstr = recordBytesToHex(rb);
    const idField = parseInt(hexstr.slice(0, 4), 16);
    let children = null;
    if (idField === 0xffff) {
      const childCount = data.readUInt16LE(pos);
      pos += 2;
      const result = deserializeNodes(data, pos, childCount);
      children = result.nodes;
      pos = result.pos;
    }
    nodes.push({ rec: hexstr, children });
  }
  return { nodes, pos };
}

function treeToText(nodes, indent = 0) {
  const pad = '    '.repeat(indent);
  const lines = [];
  for (const node of nodes) {
    lines.push(pad + node.rec);
    if (node.children !== null) {
      lines.push(pad + '<');
      lines.push(...treeToText(node.children, indent + 1));
      lines.push(pad + '>');
    }
  }
  return lines;
}

function decode(byteData, { hasImplicitRoot = true } = {}) {
  const data = Buffer.isBuffer(byteData) ? byteData : Buffer.from(byteData);
  const version = data[0];
  const totalNodeCount = data.readUInt16LE(1);
  let pos = 3;

  let nodes;
  if (hasImplicitRoot) {
    pos += 18; // skip the root record itself
    const topCount = data.readUInt16LE(pos);
    pos += 2;
    const result = deserializeNodes(data, pos, topCount);
    nodes = result.nodes;
    pos = result.pos;
  } else {
    const result = deserializeNodes(data, pos, totalNodeCount);
    nodes = result.nodes;
    pos = result.pos;
  }
  return { text: treeToText(nodes).join('\n'), version, totalNodeCount };
}

export {
    encode,
    decode,
    parseTreeText,
    countNodes,
    ROOT_RECORD_HEX
};
