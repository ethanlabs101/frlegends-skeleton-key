# Technical Breakdowns

This document provides a deeper look into the technical research, engineering decisions, experiments, and discoveries behind FR Legends Skeleton Key.

Skeleton Key did not begin as a fully planned application with a predefined architecture.

It began with curiosity.

The project grew through experimentation with FR Legends internals, memory research, serialized data, existing proof-of-concept tooling, network behavior, and the game's underlying player-data structures.

Over time, what originally appeared to be a small collection of partially functional components evolved into a much larger system.

This document covers that evolution.

Rather than functioning as a traditional user guide, these breakdowns focus on the technical side of the project:

* How the original research direction evolved
* How the initial proof of concept was discovered and expanded
* The transition from memory-based experimentation to structured data manipulation
* Understanding and processing player-data structures
* Serialization and reconstruction workflows
* Building codecs for binary livery data
* Treating decoded game data as manipulatable objects
* Constructing pipelines around those objects
* Garage management, payloads, backups, and provisioning
* Building a persistent local identity vault
* The evolution of the CLI into an interface sitting on top of the underlying framework

Some sections describe confirmed implementations currently used by Skeleton Key. Others document experimental research, dead ends, prototypes, and discoveries that influenced the architecture.

The goal is not just to document what Skeleton Key does.

It is to document how the project was discovered, understood, and engineered into its current form.

---

## Table of Contents

1. **From Curiosity to a Framework**
2. **Discovering the Original Proof of Concept**
3. **Moving Beyond Memory Modification**
4. **Understanding the Player Data Pipeline**
5. **Provisioning and Client Communication**
6. **Serialization, Decoding, and Reconstruction**
7. **Livery Binary Research and Codec Development**
8. **Treating Game Data as Structured Objects**
9. **Building the Car and Payload Pipeline**
10. **Garage Management and Save Operations**
11. **The Persistent Identity Vault**
12. **Backups, Snapshots, and Data Safety**
13. **The CLI as an Interface Layer**
14. **Architecture Evolution**
15. **Lessons Learned**
16. **Future Research Directions**

---

# 1. From Curiosity to a Framework

## Technical Origins

Skeleton Key did not begin as a traditional application idea.

It began with curiosity about FR Legends.

My earliest work focused primarily on client-side experimentation. I used GameGuardian, Lua scripting, memory inspection, hex dumps, and reverse-engineering tools to better understand how the game represented data in memory and how different systems behaved.

During that period, I was also experimenting with a newer scripting engine and expanding my reverse-engineering workflow through tools and resources such as Ghidra and `dump.cs`.

This gave me a growing collection of observations about the game, including structured values, offsets, serialized data, and educated guesses about how different systems were connected.

Then I found something unexpected.

### The Initial Proof of Concept

During my research, I came across an abandoned client wrapper and player-data decoder proof of concept.

The project was barely functional and was not a complete framework. It did not provide a polished interface, a complete architecture, or a practical system for managing player data.

However, it demonstrated something extremely important.

There was a path to interacting with player data outside of traditional client-side memory modification.

At that point, I temporarily stepped away from GameGuardian scripting and shifted my attention toward understanding what I had actually found.

The initial challenge was not immediately building features.

The challenge was understanding the system itself.

I had access to pieces of a workflow, but I needed to determine:

* What each component was doing
* How the client communication workflow functioned
* How player data was represented
* How serialized data could be decoded and reconstructed
* Which parts of the original proof of concept were incomplete or unreliable
* What information was required to reproduce supported workflows consistently

My previous reverse-engineering work turned out to be useful during this transition.

Because I had already spent time examining memory structures, hex dumps, and metadata produced through tools such as `dump.cs`, I was not approaching the new data-processing angle completely blind. I already had observations and educated guesses about how certain structures and values related to the game.

The perspective changed.

Instead of asking:

> "What can I modify inside the game's memory?"

I increasingly began asking:

> "What does the underlying data look like, how is it processed, and what can be done once it is reconstructed into a usable form?"

That became the foundation of Skeleton Key.

---

### From Proof of Concept to Research Framework

Once I began understanding the existing client and data-processing workflow, the project expanded quickly.

I started mapping the structures and behaviors I could observe, testing controlled modifications, comparing data before and after normal game actions, and gradually building a more complete understanding of the available player-data structures.

This led to experimentation with structured player data, including workflows involving:

* Reading and inspecting decoded data
* Manipulating supported fields
* Reconstructing modified data
* Working with reusable car data
* Provisioning and cloning workflows
* Building repeatable processing pipelines

As the research progressed, I also worked through communication details required for supported provisioning workflows, including reproducing the expected data transformations necessary for the client to communicate correctly.

At this point, Skeleton Key was no longer simply an experiment with a decoder.

It was becoming infrastructure.

---

### The Binary Data Problem

One of the more significant discoveries came from working with liveries.

Unlike much of the structured player data that could be represented and manipulated as JavaScript objects, livery information involved serialized binary data.

This required a different approach.

Instead of simply modifying readable fields, I needed to understand how the livery data could be decoded, represented, modified, and reconstructed without destroying the structure.

That research eventually led to the development of codec and data-processing systems capable of working with supported livery representations.

This was another major architectural shift.

Skeleton Key was no longer only concerned with reading player data.

It now needed to support multiple forms of data processing:

```text
Structured Player Data
        ↓
Decode
        ↓
JavaScript Objects
        ↓
Inspect / Modify
        ↓
Validate
        ↓
Reconstruct


Serialized Livery Data
        ↓
Decode
        ↓
Structured Representation
        ↓
Transform
        ↓
Encode
        ↓
Reconstruct
```

Different data types required different processing pipelines, but the architectural idea remained similar:

Convert opaque data into a representation that can be understood and manipulated, perform controlled operations, then reconstruct the data into a compatible format.

---

### Building Systems Around the Data

Eventually, manipulating individual fields stopped being enough.

Once the data could be understood as structured objects, the next question became:

> What systems can be built around those objects?

That led to the development of broader framework components, including:

* Garage and car-object management
* Reusable payload systems
* Backup and recovery workflows
* Data validation
* Structured modification pipelines
* Livery processing
* Persistent local identity management
* Account vault infrastructure

Each additional system was built around the same general idea.

The underlying data-processing engine should not depend entirely on the user interface.

The CLI should be able to call the underlying systems, but the systems themselves should remain useful independently.

This separation eventually became one of Skeleton Key's most important architectural characteristics.

---

### The CLI Became the Interface

By the time the project reached its current architecture, the terminal interface was no longer the project itself.

It had become the frontend sitting on top of a collection of underlying systems.

The client communication layer, player-data processing pipeline, codecs, garage systems, payload handling, validation logic, backups, and local vault infrastructure form the underlying framework.

The CLI connects those systems into workflows that can actually be used.

The development path therefore looked something like this:

```text
Curiosity About FR Legends Internals
        ↓
GameGuardian / Memory Experimentation
        ↓
Lua Scripting and Reverse Engineering
        ↓
New Scripting Engine / Ghidra / dump.cs Investigation
        ↓
Discovery of an Abandoned Client Wrapper and Decoder Proof of Concept
        ↓
Understanding the Existing Research
        ↓
Mapping Structures and Data
        ↓
Shifting from Memory Modification to Data Processing
        ↓
Structured Data Manipulation and Reconstruction
        ↓
Client Workflow Research
        ↓
Provisioning and Object Workflows
        ↓
Livery Binary Research
        ↓
Codec Development
        ↓
Reusable Processing Pipelines
        ↓
Garage Management
        ↓
Payloads and Backups
        ↓
Persistent Local Identity Vault
        ↓
Skeleton Key CLI
```

The result was not something I originally planned to build.

I found a proof of concept, recognized its potential, and then spent the following development process learning enough about the surrounding systems to turn a collection of incomplete ideas into something larger.

Skeleton Key is the result of that process.

A proof of concept became a research project.

The research project became a collection of tools.

The collection of tools eventually became a framework.

And the CLI became the interface sitting on top of it all.

---
