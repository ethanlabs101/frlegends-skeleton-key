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
2. **[Discovering the Original Proof of Concept](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/TECHNICAL-BREAKDOWNS.md#2-discovering-the-original-proof-of-concept)**
3. **[Moving Beyond Memory Modification](https://github.com/ethanlabs101/frlegends-skeleton-key/blob/main/docs/TECHNICAL-BREAKDOWNS.md#3-moving-beyond-memory-modification)**
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

My FR Legends research did not start with the player-data system.

Before I ever found the original `frlegends-cli` proof of concept, I was already familiar with Lua, GameGuardian, and `dump.cs`.

I had already spent time working with runtime memory, scripting, class structures, offsets, and reverse-engineering workflows.

FR Legends became another environment to apply those skills to.

---

## Runtime Experimentation

The earliest FR Legends research was primarily black-box experimentation.

I wanted to understand how the game behaved before worrying too much about how the underlying implementation worked.

That meant observing what changed when different actions were performed, looking at values in memory, testing modifications, and gradually building a picture of what was happening internally.

GameGuardian was useful for this because it allowed me to interact directly with the running process.

Lua then provided a way to turn individual experiments into repeatable scripts instead of manually performing the same operations every time.

At this stage, the approach was still heavily runtime-oriented:

```text
Running Game
     |
     v
Observe Behavior
     |
     v
Find Runtime Value
     |
     v
Identify Structure / Offset
     |
     v
Modify Value
     |
     v
Observe Result
```

This was useful for learning.

It was also useful for discovering relationships that were not obvious from the game's normal interface.

But I did not want to stay at the level of manually finding and changing individual values.

---

## Using Structural Information

Alongside GameGuardian experimentation, I started using tools such as Ghidra, hex dumps, and `dump.cs` to get a better understanding of what was actually underneath the runtime behavior.

`dump.cs` was particularly useful for basic experimentation because it provided structural information that could help turn a completely unknown memory location into something more meaningful.

Instead of simply seeing:

```text
0xXXXXXXXX
```

I could begin thinking in terms of:

```text
Class
 ├── Field
 ├── Field
 ├── Field
 └── Field
```

That changed the nature of the research.

An offset was no longer just an arbitrary address.

It could represent a field inside a known object.

A pointer could lead to another object.

Multiple fields could belong to the same structure.

Those relationships made it possible to reason about the game's runtime state rather than simply search for numbers.

This was still memory research, but it was becoming increasingly structural.

---

## From Individual Patches to Reusable Logic

At some point, I found a general-purpose method and field-offset patching tool.

It was not built specifically for FR Legends.

The underlying idea was useful, but the implementation was much more complicated and bloated than what I actually needed.

Rather than simply using it as-is, I started stripping away the parts that were unnecessary and reorganizing the useful functionality.

The goal was to make the repetitive parts of the workflow reusable.

Instead of every feature having to implement its own search, resolution, offset handling, and write logic, those operations could be handled by shared functions.

The result was a much cleaner abstraction:

```text
Feature Definition
       |
       v
Shared Resolution Logic
       |
       v
Target Discovery
       |
       v
Field / Pointer Resolution
       |
       v
Operation
```

That meant a feature could describe what it wanted to modify without having to completely reinvent the underlying memory workflow.

This was an important shift in how I approached the project.

I was no longer just writing individual modifications.

I was building infrastructure that could perform modifications.

---

## Treating Operations as Data

That abstraction eventually allowed different kinds of operations to be represented in a common format.

A basic operation could describe things such as:

```text
Name
Class
Offset
Type
Value
```

Other operations could describe more complicated behavior:

```text
Multi-field structure
Pointer chain
Toggle
Slider
User input
Freeze state
Custom function
```

The menu could then sit above those definitions instead of containing all of the low-level logic itself.

Conceptually:

```text
                    Menu
                     |
                     v
             Operation Definition
                     |
                     v
              Shared Functions
                     |
                     v
              Memory Resolution
                     |
                     v
                 Target
                     |
                     v
                 Modify
```

This separation was important because it meant the interface and the underlying operation were no longer the same thing.

The menu was just a way to request an operation.

The engine underneath handled the difficult part.

That pattern would become surprisingly important later.

---

## Runtime Data Was More Complicated Than It Looked

The more I experimented with the running game, the more obvious it became that seeing a value in memory did not necessarily mean I understood the value itself.

A value could have relationships to other objects.

It could be reached through pointers.

It could be represented differently internally than it appeared to the player.

It could be generated or transformed at runtime.

It could also change between game versions.

That last part was especially important.

A memory-based approach can be extremely powerful, but it is inherently tied to the current implementation of the running client.

If the game's structures change, offsets can move.

If objects are reorganized, pointer relationships can change.

If a value's representation changes, simply finding the same-looking value is no longer enough.

This became particularly obvious when looking at currency-related values.

---

## The Problem of Representation

One of the things I eventually had to learn was that the value I wanted was not always the value the game was actually storing in the obvious form.

For example, the game could internally represent certain values using an obfuscated representation rather than simply storing the plaintext number directly.

Conceptually:

```text
Plaintext Value
      |
      v
Internal Transformation
      |
      v
Stored Representation
```

And the game could reverse that process internally:

```text
Stored Representation
      |
      v
Internal Transformation
      |
      v
Plaintext Value
```

This distinction mattered.

Finding a memory location containing a value was one problem.

Understanding **why that value looked the way it did** was a completely different problem.

That pushed my research further away from simply asking:

> "Where is this value?"

and toward asking:

> "How is this value represented?"

That was a major change in perspective.

---

## The Limits of Runtime Modification

None of this made GameGuardian or memory research useless.

Quite the opposite.

That work taught me how to inspect the game, identify structures, trace relationships, test hypotheses, and build reusable tooling around difficult runtime operations.

But it also showed me the limitations of making the running process the center of the entire system.

A runtime modification workflow generally looks like:

```text
Start Game
    |
    v
Find Runtime Object
    |
    v
Resolve Address
    |
    v
Modify Memory
    |
    v
Keep Process Running
```

That can be extremely effective for experimentation.

But it is not necessarily the best foundation for persistent data management.

If the goal is to build something that can understand, manipulate, save, back up, reconstruct, and transport player data, then constantly operating inside the live process creates unnecessary dependencies.

I started becoming more interested in the layer underneath the runtime state.

---

## The Question Changed

This was the important transition.

Instead of primarily asking:

> "How can I change this value while the game is running?"

I started asking:

> "Where did this value come from?"

Then:

> "How is it represented?"

Then:

> "What does the game actually save?"

And eventually:

> "Can I work with the saved representation directly?"

Those questions led naturally toward serialized player data.

---

## Discovering the Original Proof of Concept

The original `frlegends-cli` proof of concept appeared during this period while I was working on another project.

I looked at it and realized that it already contained some primitives for communicating with the game's backend and processing player data.

It was primitive and largely broken by the time I found it, but that was not really the important part.

The interesting part was the layer it exposed.

I had already been studying the game from the outside through runtime memory.

Now there was another possibility:

```text
Running Game
     |
     | Runtime Research
     v
Memory / Objects / Fields
```

versus:

```text
Saved Player Data
     |
     | Decode / Process
     v
Structured Data
```

That second approach opened a completely different research direction.

I did not have to abandon the knowledge I gained from memory research.

I could apply it to understanding the structures represented by the persistent data.

---

## From Runtime Objects to Persistent Data

This became one of the biggest conceptual shifts in the project.

Memory research taught me to think about the game in terms of:

```text
Classes
Fields
Pointers
Values
Relationships
```

Player-data research introduced another representation:

```text
Serialized Data
      |
      v
Decoded Structure
      |
      v
Objects / Fields
      |
      v
Modified Structure
      |
      v
Reconstructed Data
```

The underlying idea was similar.

I was still trying to understand structures and relationships.

The difference was where I was interacting with them.

Instead of only modifying an object while the game was running, I could begin working with a representation of the player's state outside of the running process.

That was far more interesting for the kind of tooling I wanted to build.

---

## The Abstraction Carried Over

Looking back, the transition from memory modification to player-data manipulation was not actually as drastic as it might appear.

The technology changed.

The layer changed.

The engineering problem changed.

But the underlying approach stayed surprisingly consistent.

With runtime research, I had learned to separate:

```text
What I want to do
        |
        v
How the target is found
        |
        v
How the target is resolved
        |
        v
How the operation is performed
```

With player data, the same philosophy could be applied:

```text
What I want to change
        |
        v
How the data is decoded
        |
        v
How the structure is represented
        |
        v
How the object is modified
        |
        v
How the data is reconstructed
```

That separation eventually became one of the core architectural ideas behind Skeleton Key.

---

## The Shift

At this point, I was no longer looking at FR Legends as simply a running game process that could be modified.

I was starting to look at it as a collection of systems and representations that could be understood independently.

The progression was roughly:

```text
Black-Box Experimentation
        |
        v
GameGuardian / Lua
        |
        v
Ghidra / Hex / dump.cs
        |
        v
Runtime Structures
        |
        v
Reusable Memory Operations
        |
        v
Understanding Value Representation
        |
        v
Player-Data Research
        |
        v
Structured Data Processing
```

The important change was not that I stopped using memory research.

It was that memory research stopped being the entire picture.

It became one layer of understanding the game.

The player-data pipeline became another.

And once those two perspectives started connecting, the project had a much larger foundation to build on.

That is where Skeleton Key began moving beyond a collection of modifications and toward an actual framework.

---

# 4. Understanding the Player Data Pipeline

Once I started looking beyond runtime memory, the next problem was understanding what the game actually did with player data.

Changing something while the game was running was one thing. Understanding what happened when that data was saved, transmitted, encoded, decoded, reconstructed, and loaded again was a completely different problem.

That distinction became important because the game was not simply storing a collection of readable values.

There was a pipeline.

## 4.1 From Runtime State to Persistent Data

Runtime experimentation taught me how to locate and manipulate values while the game was active.

Persistent data required a different way of thinking.

Instead of asking:

> "Where is this value in memory?"

I started asking:

> "What does this value look like when the game saves it?"

That meant looking at actual player-data payloads and comparing them across different states.

Changing something in-game and then examining the resulting player data made it possible to correlate a gameplay action with a change in the serialized representation.

This was a much more useful perspective than treating the save as an opaque file.

The goal was no longer simply to modify a value.

The goal was to understand the transformation between:

```text
Game State
    ↓
Player Data Object
    ↓
Serialization / Encoding
    ↓
Stored or Transmitted Representation
```

and, in the opposite direction:

```text
Stored Representation
    ↓
Decoding / Decompression
    ↓
Player Data Object
    ↓
Game State
```

Once I started thinking about the data as a pipeline, individual values stopped being isolated problems.

They became parts of a larger system.

## 4.2 Discovering the Structure Behind the Payload

The first major step was determining that the player data could be reconstructed into a structured object rather than treated as an arbitrary binary blob.

That changed everything.

Instead of manually searching through raw data every time I wanted to understand something, I could work with recognizable fields and structures.

The decoded representation contained things such as:

- player information
- balances
- timestamps
- game-version information
- car data
- other persistent state

The important part was not simply identifying individual fields.

It was establishing a repeatable process for getting from the game's encoded representation to something that could be inspected and manipulated programmatically.

That became the foundation for the later Skeleton Key data model.

## 4.3 Serialization Was Its Own Problem

One of the easiest mistakes at this stage would have been to assume that decoding the player data meant the reverse-engineering problem was solved.

It wasn't.

Being able to decode data is only half of a serialization system.

The other half is being able to reconstruct it correctly.

That meant understanding both directions:

```text
Encoded Data → Decode → Structured Data

Structured Data → Encode → Encoded Data
```

A useful decoder without a reliable encoder would only provide an inspection tool.

Skeleton Key needed both.

The implementation therefore had to preserve enough information from the original representation to reconstruct valid output rather than simply generating a new arbitrary representation.

This distinction became increasingly important as more complex modifications were introduced.

## 4.4 Separating Data From the Interface

Another important realization was that none of this really belonged in the CLI itself.

The CLI could provide menus, prompts, status displays, and commands.

It should not be responsible for understanding every detail of the underlying player-data format.

That logic belonged underneath the interface.

The architecture gradually moved toward a separation similar to the abstractions I had already built during runtime research:

```text
CLI
 ↓
Operation / Manager
 ↓
Structured Data
 ↓
Codec / Serialization Layer
 ↓
Raw Player Data
```

This meant the same underlying data-processing logic could eventually be used by something other than a terminal menu.

That became one of the recurring design principles behind Skeleton Key:

> The interface should not define the system.

The CLI is simply one way of interacting with the system.

## 4.5 Values Were Not Always What They Appeared to Be

While examining the player-data pipeline, another complication became apparent.

Some values could not simply be treated as ordinary plaintext numbers.

In particular, certain in-game values were represented using additional transformations rather than being stored exactly as they appeared inside the game.

This was where the distinction between serialization and value representation became important.

The player-data serialization layer had its own encoding behavior.

Individual values could also have their own representation or obfuscation.

Those were separate problems.

Understanding one did not automatically solve the other.

This became especially important when dealing with currency-related values.

The old proof of concept I had discovered earlier contained an outdated approach to money modification, but that approach was no longer valid by the time I found it. The game had changed how those values were represented.

That meant the value representation itself had to be investigated independently.

The useful question became:

> "What transformation connects the value I can observe to the value actually stored?"

That research eventually led to identifying the XOR relationship involved in the relevant value representation.

This was not something inherited from the original proof of concept.

It was part of the later reverse-engineering work that happened during Skeleton Key's development.

## 4.6 From Individual Values to Data Models

As more of the player data became understandable, another shift happened.

I stopped thinking of the save as a collection of individual values and started thinking of it as a data model.

A car was not simply a handful of unrelated numbers.

A player profile was not simply a list of fields.

The save contained relationships between objects, collections, identifiers, timestamps, and other pieces of state.

That meant modifications needed to respect the structure around them.

This eventually led to the validation and reconstruction systems used by Skeleton Key.

Instead of blindly changing bytes, the framework could operate on structured representations and then validate the result before encoding it again.

Conceptually:

```text
Raw Save
   ↓
Decode
   ↓
Structured Object
   ↓
Validate
   ↓
Modify
   ↓
Validate Again
   ↓
Encode
   ↓
Raw Save
```

That pipeline became much more powerful than treating every modification as an isolated patch.

## 4.7 The Beginning of the Framework

This was the point where the project started becoming something more than a collection of reverse-engineering experiments.

The earlier runtime work had taught me how to build reusable abstractions around repeated operations.

The player-data research applied the same philosophy at a different layer.

Instead of:

```text
Find value
→ Patch value
→ Repeat
```

the system became:

```text
Decode
→ Understand
→ Represent
→ Transform
→ Validate
→ Encode
```

That distinction is one of the biggest foundations of Skeleton Key.

The project was no longer primarily about changing something.

It was becoming about understanding a data system well enough to build reusable tooling around it.

That change in perspective is what made the later garage system, car construction, livery tooling, backups, identity management, and other components possible.

The CLI came later.

The framework started here.

---

# 5. Provisioning and Client Communication

Once the player-data pipeline became understandable, the next problem was getting that data in and out of the game consistently.

Understanding a payload is useful, but a framework needs a reliable way to communicate with the systems responsible for that data.

This is where the client layer became important.

## 5.1 From Local Data to Backend Communication

The original proof of concept gave me a useful starting point for communicating with the game's backend.

The existing client implementation already demonstrated the basic concepts required to authenticate, establish a session, and communicate with the relevant backend services.

That was one of the pieces I was able to carry forward.

However, having a client capable of making requests was only the beginning.

Skeleton Key needed to understand what those requests actually represented and how they fit into the larger player-data workflow.

The architecture gradually became:

```text
Skeleton Key
    ↓
Client Layer
    ↓
Backend Communication
    ↓
Player Data
    ↓
Decode / Process
    ↓
Structured Data
```

And when saving changes:

```text
Structured Data
    ↓
Validate / Transform
    ↓
Encode
    ↓
Client Layer
    ↓
Backend Communication
    ↓
Persistent Player Data
```

The important distinction was that the client should handle communication, while the rest of the framework handled what the data meant.

## 5.2 Authentication Is Part of the Pipeline

Authentication was not treated as an isolated login screen.

It became part of the overall data pipeline.

The framework needed to establish the appropriate authenticated context before it could reliably retrieve or modify player information.

That meant dealing with things such as:

- account authentication
- session information
- entity information
- player identifiers
- authenticated requests
- account-specific data

The client layer therefore became responsible for maintaining the communication state required by the rest of the application.

This also reinforced an architectural rule that would become important later:

> Authentication and data processing are separate concerns.

The system should be able to determine who it is communicating as without embedding account logic throughout every feature.

## 5.3 The Client Became a Reusable Abstraction

Rather than having every feature construct its own backend requests, the client became a shared interface.

Higher-level systems could request the operation they needed without needing to understand the underlying communication details.

Conceptually:

```text
Garage Manager
       ↓
Player Data Manager
       ↓
Client
       ↓
Backend
```

Instead of:

```text
Garage Manager
       ↓
Build HTTP Request
       ↓
Authenticate
       ↓
Construct Headers
       ↓
Send Request
       ↓
Parse Response
```

That separation made the rest of the project considerably easier to reason about.

If the communication mechanism changed, the higher-level systems would not need to be rewritten around it.

The same principle had already appeared in my earlier runtime tooling.

Repeated low-level work belonged in a shared abstraction rather than being duplicated across individual operations.

## 5.4 Understanding the Available Data

Communication alone was not enough.

I needed to determine which backend data actually mattered to Skeleton Key.

The player-data system exposed information that could be processed into the structured representation used by the framework.

Other backend systems exposed additional information related to things such as:

- account state
- player data
- inventory
- virtual currency
- cloud-backed data
- files and file operations
- other player-specific state

Not every available operation became a Skeleton Key feature.

The important part was understanding the boundaries between them.

Some information belonged to the persistent player-data pipeline.

Some belonged to account or authentication state.

Some represented backend-managed resources.

Keeping those distinctions clear prevented the framework from becoming one giant collection of unrelated API calls.

## 5.5 Provisioning Data for Local Processing

One of the more important architectural decisions was allowing remote player data to be brought into a local processing pipeline.

The framework could retrieve the relevant data, decode it, and turn it into something the rest of Skeleton Key could work with.

That created a repeatable workflow:

```text
Authenticate
    ↓
Retrieve Player Data
    ↓
Decode
    ↓
Parse
    ↓
Validate Structure
    ↓
Create Working Representation
```

At that point, the data was no longer something that only existed on the remote side.

It became a structured local representation that could be inspected, transformed, backed up, and eventually reconstructed.

This was a major step toward treating player data as an actual dataset rather than something that had to be manipulated entirely through the game itself.

## 5.6 Keeping the Backend Layer Thin

The client was intentionally kept relatively low-level.

It knew how to communicate.

It did not need to know what a "garage" meant.

It did not need to know how a car should be constructed.

It did not need to know how a livery should be edited.

It did not need to know what a valid player-data structure looked like.

Those responsibilities belonged to higher layers.

The separation became roughly:

```text
CLI
 ↓
Feature / Manager
 ↓
Data Model / Operations
 ↓
Codec / Serialization
 ↓
Client
 ↓
Backend
```

Each layer had a different responsibility.

That separation made it possible to keep adding functionality without turning the client into the center of the entire project.

## 5.7 Provisioning Became More Than Fetching

As Skeleton Key grew, provisioning stopped meaning simply "download the save."

The framework needed to prepare data for different operations.

That could include retrieving the current player state, creating local working data, loading templates, constructing objects, preserving required fields, and preparing the resulting payload for encoding.

This eventually led to the concept of **payload management**.

A payload was not just raw data.

It was a structured representation that could move through multiple stages of the framework.

```text
Remote Data
    ↓
Decode
    ↓
Payload
    ↓
Modify
    ↓
Validate
    ↓
Encode
    ↓
Remote Data
```

This concept became increasingly important as features such as garage management and car construction were added.

## 5.8 The Importance of Separation

At this point, the project had several different problems that could easily have been mixed together:

- authentication
- backend communication
- serialization
- value representation
- structured player data
- modification logic
- validation
- local storage

Keeping these separate was what allowed Skeleton Key to continue growing.

The client handled communication.

The codec handled serialization.

The data model handled structure.

Feature managers handled specific operations.

The CLI handled interaction.

This separation was not designed perfectly from the beginning.

It evolved as the problems became clearer.

That is an important part of Skeleton Key's development history: the architecture was shaped by reverse engineering rather than designed around assumptions before the underlying systems were understood.

## 5.9 From Communication to a Working Framework

With authentication, communication, decoding, and structured data processing working together, Skeleton Key had the beginnings of an actual end-to-end pipeline.

The workflow was no longer a collection of disconnected experiments.

It was becoming a system:

```text
Account
   ↓
Authenticated Client
   ↓
Player Data
   ↓
Decode
   ↓
Structured Representation
   ↓
Feature Operations
   ↓
Validation
   ↓
Encode
   ↓
Client
   ↓
Persistent Data
```

That foundation made the next major problem possible:

**understanding the serialization process deeply enough to reliably reconstruct the data.**

That would become one of the most important technical areas of the project.

---

# 6. Serialization, Decoding, and Reconstruction

Once I had a working understanding of the player-data pipeline, I needed a reliable way to move between the game's encoded player-data representation and something Skeleton Key could actually work with.

This is where the original `pd.js` from the earlier proof of concept became useful.

I did not build the original player-data serialization system from scratch. I inherited that foundation and then reworked it into a cleaner and more general implementation that better fit the direction Skeleton Key was taking.

That distinction matters because this was one of the first places where I was building on an existing reverse-engineering discovery rather than starting entirely from zero.

## 6.1 The Original Player-Data Codec

The original implementation established the basic player-data transformation:

```text
Encoded Player Data
        ↓
XOR
        ↓
GZIP Data
        ↓
JSON
```

The reverse process was:

```text
JSON
        ↓
GZIP
        ↓
Prefix + GZIP
        ↓
XOR
        ↓
Encoded Player Data
```

The original implementation also had a default XOR key and could search through the possible byte values if the preferred key did not produce a valid gzip header.

That gave me the core mechanism I needed.

However, I wanted the codec to be less dependent on assumptions about what the key was supposed to be.

## 6.2 Generalizing XOR Key Discovery

One of the main changes I made was simplifying the key-discovery process.

Rather than relying on a known default key first, my implementation could simply test the full 8-bit XOR key space:

```text
0x00 → 0xFF
```

For each candidate key, the data was XOR-transformed and checked for the recognizable gzip signature.

Conceptually:

```text
Unknown XOR Key
      ↓
Try Key 0
      ↓
Try Key 1
      ↓
Try Key 2
      ↓
...
      ↓
Try Key 255
      ↓
Candidate GZIP Data
```

This made the decoder independent of having to know the expected key ahead of time.

The important part was not merely brute-forcing 256 possible values.

The important part was being able to automatically identify which candidate actually produced valid data.

## 6.3 Validating the Candidate Instead of Trusting the Header

A byte pattern alone is not enough to prove that the correct XOR key has been found.

A random transformation could theoretically produce bytes resembling a gzip header somewhere in the buffer.

I therefore used the gzip signature as the first detection step and then attempted to actually decompress the resulting data.

If decompression failed, that candidate key was discarded and the search continued.

If decompression succeeded, the resulting data was then parsed as UTF-8 JSON.

That created a stronger validation chain:

```text
Candidate XOR Key
       ↓
XOR Buffer
       ↓
Find GZIP Signature
       ↓
Attempt GZIP Decompression
       ↓
Parse JSON
       ↓
Confirmed Representation
```

This was a more useful approach than simply stopping when a matching byte pattern was found.

The decoder was effectively asking:

> "Does this key actually produce a valid player-data payload?"

rather than:

> "Did I happen to find the right-looking bytes?"

## 6.4 Preserving the Prefix

The player-data representation also contained data before the compressed JSON payload.

Once the gzip region was located, the decoder preserved everything before that region as the payload prefix.

The decoded result therefore retained three important pieces of information:

```text
json
prefix
xorKey
```

The structured JSON represented the actual player-data content.

The prefix preserved the portion of the original representation that needed to remain present during reconstruction.

The recovered XOR key allowed the encoded representation to be rebuilt using the same transformation discovered during decoding.

This made the decode result useful not just for inspection, but for reconstruction.

## 6.5 Reconstruction Was Part of the Design

A decoder by itself would only solve half of the problem.

Skeleton Key needed to modify player data and produce a representation that could be reconstructed afterward.

The encoder therefore reversed the process:

```text
Structured JSON
      ↓
JSON.stringify
      ↓
GZIP
      ↓
Prefix + GZIP
      ↓
XOR With Recovered Key
      ↓
Encoded Player Data
```

This meant the codec could preserve the relationship between the decoded representation and the encoded representation.

The result was a reusable round-trip:

```text
Encoded Data
      ↓
    Decode
      ↓
Structured Data
      ↓
   Modify
      ↓
    Encode
      ↓
Encoded Data
```

That round-trip became the important part.

## 6.6 Making the Codec Fit Skeleton Key

The original `pd.js` was useful, but Skeleton Key was becoming a larger system.

I wanted the serialization layer to have a simple responsibility:

> Convert between the game's player-data representation and a structured object while preserving the information necessary to reconstruct it.

That meant the rest of the framework did not need to know how the XOR search worked.

It did not need to know how gzip was located.

It did not need to know how the prefix was preserved.

It could simply work with the decoded result.

Conceptually:

```text
Feature / Manager
       ↓
Structured Player Data
       ↓
Player-Data Codec
       ↓
Encoded Representation
```

The codec became an abstraction boundary.

## 6.7 Separating Player-Data Encoding From Value Representation

This was also where I had to keep two different reverse-engineering problems separate.

The XOR used by the player-data serialization layer was not the same problem as the XOR-based representation I later investigated for individual in-game values.

The player-data codec dealt with the transformation of the overall payload.

Individual values could have their own representation or obfuscation.

Those layers should not be treated as one system.

The original proof of concept had an older approach to money modification, but that functionality had already stopped working before I discovered the project because the game's representation of certain values had changed.

The later research into those value representations was separate work.

That research eventually led me to build a better approach for identifying XOR relationships rather than relying on the old implementation.

So there were two distinct pieces of work:

```text
Player-Data Serialization
    ↓
Inherited from the original PoC
    ↓
Refactored / generalized by me


Individual Value Representation
    ↓
Investigated separately
    ↓
XOR relationship research
    ↓
Improved XOR analysis tooling
```

Keeping those distinctions clear was important as the framework grew.

## 6.8 From a Codec to Infrastructure

At first, `pd.js` was simply a utility for decoding and encoding player data.

As Skeleton Key developed, the codec became infrastructure that other systems could depend on.

Higher-level features could operate on structured data without having to understand the raw representation underneath it.

That created a separation between:

```text
Raw Representation
```

and:

```text
Meaningful Data
```

The codec handled the translation between them.

That allowed other systems to focus on what the data represented rather than repeatedly dealing with the underlying serialization mechanism.

## 6.9 The Larger Pipeline

By this point, the player-data workflow could be represented as:

```text
Authenticated Client
        ↓
Retrieve Player Data
        ↓
Encoded Representation
        ↓
Player-Data Codec
        ↓
Structured Data
        ↓
Feature Operations
        ↓
Validation
        ↓
Player-Data Codec
        ↓
Encoded Representation
        ↓
Client
```

This was an important architectural milestone.

The framework now had a clear boundary between communication, serialization, and higher-level operations.

The client handled communication.

The codec handled the player-data representation.

The higher-level systems handled what the data actually meant.

The CLI handled interaction with the user.

Each layer could evolve without requiring the entire project to be rewritten.

## 6.10 Why This Became Important Later

The player-data codec was not the end of the reverse-engineering work.

It was actually the point where the project became capable of supporting more complicated research.

Once I could reliably get player data into a structured representation, I could start looking at larger objects and relationships instead of isolated values.

That eventually led into car structures, garage management, payload construction, and most importantly, the much deeper research into the game's livery binary format.

The player-data codec gave Skeleton Key a way to work with the outer player-data layer.

The livery system would require something different.

That binary format was not simply another JSON payload waiting to be decoded.

It required its own reverse-engineering process, structural analysis, transformations, reconstruction logic, and eventually a dedicated codec.

That became the next major technical challenge.

---
