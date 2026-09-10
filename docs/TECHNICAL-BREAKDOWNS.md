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

1. **[From Curiosity to a Framework](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/TECHNICAL-BREAKDOWNS.md#1-from-curiosity-to-a-framework)**
2. **[Discovering the Original Proof of Concept]()**
3. **[Moving Beyond Memory Modification]()**
4. **[Understanding the Player Data Pipeline]()**
5. **[Provisioning and Client Communication]()**
6. **[Serialization, Decoding, and Reconstruction]()**
7. **[Livery Binary Research and Codec Development]()**
8. **[Treating Game Data as Structured Objects]()**
9. **[Building the Car and Payload Pipeline]()**
10. **[Garage Management and Save Operations]()**
11. **[The Persistent Identity Vault]()**
12. **[Backups, Snapshots, and Data Safety]()**
13. **[The CLI as an Interface Layer]()**
14. **[Architecture Evolution]()**
15. **[Lessons Learned]()**
16. **[Future Research Directions]()**

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

# 2. Discovering the Original Proof of Concept

When I first found the original `frlegends-cli` project, it was already old and mostly broken.

It was not a working money editor that I simply expanded.

By the time I discovered it, the only functionality that was really usable was logging in and logging out.

That was basically it.

The project had previously been capable of more.

There was an older money-modification workflow, but a later game update changed how those values were represented and introduced XOR-based value obfuscation.

That broke the old implementation.

The important distinction here is that this was **not** the same XOR mechanism used by the serialized player-data format.

The money-value XOR was part of how the game represented individual values internally.

The player-data serialization had its own separate encoding/serialization behavior.

I did not fully understand that distinction when I first encountered the project.

What I did understand was that the repository contained pieces of research that were potentially useful.

And that was enough for me to start digging.

---

## The Three Files

The original project was extremely small.

The parts that mattered to me were essentially:

- `scripts/cli.js`
- `src/client.js`
- `src/pd.js`

That was the foundation I started with.

There was no Skeleton Key architecture waiting to be assembled.

No garage system.

No livery system.

No asset database.

No account vault.

No structured car pipeline.

No backup system.

No framework.

Just a small collection of primitives from an old proof of concept.

---

## `client.js`

The client wrapper was one of the most useful pieces.

It provided a basic interface for communicating with the game's backend and handling the authentication/session side of the process.

That gave me something important:

A starting point for understanding how the application communicated with the game's backend without having to discover every endpoint and request structure completely from scratch.

The wrapper was primitive, but it established useful concepts around:

- Authentication
- Session handling
- Player-data access
- Backend requests
- Player-file operations
- CloudScript interaction
- Save-related operations

I could work with that.

I could also study it.

That was much more valuable to me than the broken money modification itself.

---

## `pd.js`

The other major piece was the player-data codec.

This was where the original project contained some genuinely useful groundwork.

`pd.js` dealt with the game's serialized player-data representation and provided the ability to move between the stored binary representation and structured data.

Conceptually, the pipeline looked something like:

```text
Player Data
     |
     v
Serialized / encoded representation
     |
     v
Decoded data
     |
     v
Structured JSON
```

And then in reverse:

```text
Structured JSON
     |
     v
Serialized data
     |
     v
Encoded representation
     |
     v
Player Data
```

That was interesting because it meant I was not starting with a completely unknown binary blob.

There was already a primitive understanding of how the player-data format could be processed.

I could build from that.

---

## The Broken Money Modification

This is where the history needs some clarification.

The original project had a money-modification feature at one point.

But that feature **did not work anymore when I found the repository**.

It had been broken by a game update that changed the representation of money values.

The game was no longer simply storing the values in the form the old implementation expected.

Instead, the values were represented using XOR-based obfuscation.

Conceptually:

```text
Plaintext Value
      |
      v
 XOR with internal key
      |
      v
Ciphertext Representation
```

And internally, the game could perform the reverse operation:

```text
Ciphertext Representation
      |
      v
 XOR with internal key
      |
      v
Plaintext Value
```

The important part is that the original tool did not contain the solution to this new representation.

The old implementation had simply become outdated.

By the time I discovered it, I could not just run the CLI and modify money.

I could log in.

I could log out.

The modification functionality was effectively dead.

---

## Why That Was Still Useful

At first glance, finding a tool that only logs in and out might sound useless.

It wasn't.

The value was in the pieces underneath it.

`client.js` showed me how the backend communication was structured.

`pd.js` showed me that player data could be processed as structured data rather than treated as an opaque file.

`cli.js` contained small primitives showing how those pieces were intended to be used together.

That gave me a starting point.

It was not a finished solution.

It was a map.

---

## The XOR Problem Was Something I Had to Solve Later

One of the most important things to separate from the original project is the eventual solution to the XOR-based money representation.

I did **not** find the key sitting inside the old CLI.

I did **not** inherit a working money modifier.

I had to research that representation myself later.

The basic research problem became:

```text
Unknown Ciphertext
       |
       v
Find corresponding plaintext
       |
       v
Compare representations
       |
       v
Determine XOR relationship
       |
       v
Recover / identify key
       |
       v
Reproduce conversion
```

Once the plaintext/ciphertext relationship could be understood, the XOR key could be determined from that relationship.

That research became part of Skeleton Key's own technical work.

The original project only showed me that this area existed.

It did not solve it for me.

---

## What I Actually Inherited

Looking back, I would describe what I inherited from the original project as **primitives**, not a framework.

The most important pieces were:

- A basic client wrapper
- Authentication primitives
- Backend communication primitives
- Player-data access
- A player-data decoder/encoder
- Serialization-related logic
- Small pieces of CLI logic
- Evidence that the game's player data could be processed externally

That was about it.

The original project did not provide the architecture Skeleton Key eventually developed.

It provided enough working pieces and enough context for me to start investigating the system myself.

---

## What I Did Not Inherit

It is equally important to document what was **not** already there.

I did not inherit:

- A working money modifier
- A working value-XOR solution
- A garage manager
- A car-object system
- A livery editor
- A livery codec framework
- A persistent identity vault
- A backup system
- A payload system
- An asset management system
- A stock-car library
- A structured save-management framework
- The final CLI architecture

Those came later.

Some were completely new systems.

Others grew out of research that started with the primitives I found.

---

## The Real Significance of the PoC

The original project was broken.

But it had something more valuable than a working feature:

It demonstrated that the game's data and backend interactions could be studied from outside the normal game client.

That gave me a direction.

Instead of asking:

> "How do I make this old money mod work again?"

I eventually started asking:

> "What exactly is the game doing with these values?"

And then:

> "What else can be understood if I treat the game's data as data instead of just something to modify?"

That change in perspective was much more important than the original money modification ever was.

The broken tool became the starting point for a much larger investigation.

---

## From an Old PoC to Skeleton Key

The original repository did not become Skeleton Key overnight.

I had to understand what I was looking at, figure out what was still relevant, determine what had become obsolete, reverse-engineer the pieces that were missing, and build new systems around the useful primitives.

Some original code could be reused.

Some could only be studied.

Some ideas had to be completely reworked.

Eventually, the project stopped looking like the original CLI at all.

What started as:

```text
Old PoC
   |
   +-- client.js
   +-- pd.js
   +-- small CLI primitives
```

eventually became:

```text
Skeleton Key
   |
   +-- Client / Backend Layer
   +-- Player Data Layer
   +-- Serialization Pipeline
   +-- Car / Garage Systems
   +-- Livery Systems
   +-- Payload Systems
   +-- Backup / Recovery
   +-- Identity Vault
   +-- Asset Systems
   +-- CLI Interface
```

The original project was the spark.

The framework came later.

---

# 3. Moving Beyond Memory Modification
