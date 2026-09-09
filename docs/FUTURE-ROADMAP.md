## Future Road map

I will keep this short. Truthfully, the purpose of the creation of this framework was a learning experience and to provide for the FR Legends Community.
I barely play this game, and its not something I plan to monetize or grow further then the current CLI interface. However, there are a full experimental ideas,
and feasible features I would like to list here that may or may not be released. For both myself, and whoever else out there who wants to experiment themselves. 
This is open-source software after all :)

Firstly, I'd like to point out that Skeleton Key is highly portable. The underlying client wrapper, player-data decoder, serialization pipeline, and supporting systems
can be separated from the CLI and reused individually, or transplanted into an entirely different interface.

That interface could theoretically be a desktop application, Android application, web application, or another compatible frontend entirely. This portability has already been demonstrated through frlmods.com, which uses a stripped-down implementation of Skeleton Key's underlying engine and save-modification methods for its web-based money modification tool.

I can't say this tool will be fully functional ***forever*** (like 99% of game mods), and that should be acknowledged. BUT this could easily turn into a web-based asset share ecosystem
between users, a website to purchase curated assets, a classic discord bot, a website designed to sell accounts, etc. There is many possibilities and I would love to see this engine integrated into other interfaces.

Besides those types of possibilities, lets dig into what Skeleton Key/ FR Legends save data could theoretically do.

---

## Livery Modifications

Ok, this is an interesting rabbit hole. From what ive gathered from the community, real advanced livery modification tools are highly desired. The only problem with this is serialized binary data is "scary" to deal with
for most people and impossible to manipulate accurately without understanding and reverse engineering the binary structure.

All the livery modifications are out of scope for Skeleton Key and will not be included in this CLI application.

### Here is some of my findings:

1. You can create livery "color presets". I actually already worked on this experimentally. For example, its possible to apply a "Twilight" preset to a car, and specific accent colors will be shifted to blues, and purples etc. I found
if you do this and leave primary colors untouched you can successfully apply the color preset without making the livery look muddy. Protecting the primary colors here is key and also creating a map for presets for example,
dark red = dark blue, red = blue, light red = light blue. You should always back up the car before modifying it. However, maintaining consistent color mappings and protecting primary colors makes it easier to apply multiple transformations without progressively destroying the original livery's visual identity. Of course some liveries wont cleanly work with this method and its not the simplest, but worth mentioning.

2. You can simulate a blender-like livery application to resize, fit liveries onto other car models, apply liveries and much more. I haven't gone far with this, and to be honest it would almost be laughable if something like this existed
for such a small niche car game. This requires understanding the livery binary structure well enough to accurately manipulate positional, dimensional, rotational, and color data. I made a prototype of this (non graphical) and enjoyed the idea of
making such a feature, but its out of scope for Skeleton Key and CLI interfaces period. Theoretically, you could create a lightweight rendering engine, render the unity assets in browser and try to simulate FR Legends in-game livery
application, and if you maintain the binary data, you can apply it to a car object, and boom car. This is very high effort though, and I wouldn't be surprised if it never happened.

3. You can move liveries across car models and have them sized perfectly. If you don't want to program a blender clone like #2, this could hypothetically be achieved from a scripted livery manipulation workflow, then trial-and-error checking repeatedly in-game to see if you can get the perfect translation across car models. This is also high effort, and would have to be repeated across all the car models in the game, but another cool possibility even if tedious. 


There is more like image to binary etc, but that I have not tested or speculated about. I have seen an example such as on frlmods.com but in my opinion and others, its very primitive.

---

## Hex Bodyshop

Here's another cool one.

It is common knowledge within the community to perform "hex body swaps," which involves applying body parts from one car model to another. This can result in unique-looking cars that are not normally possible to create through the game's standard customization system.

Since Skeleton Key operates at the save and data-processing layer and can work directly with plaintext car objects, rather than modifying game memory through Game Guardian or similar alternatives, this feature is very feasible within Skeleton Key's current architecture.

This feature **IS** in scope and is one of the additions I am strongly considering for the near future.

### 1. Hex Bodyshop

The goal would be relatively simple.

Skeleton Key would maintain a mapped library of compatible FR Legends body parts. The user could select a stock car, browse available body components, mix and match parts from different vehicles, and then either:

- Inject the completed car directly into the active garage
- Save the completed car as a reusable payload

Relatively simple compared to some of the more experimental ideas in this roadmap, but potentially one of the more practical additions because the underlying car-object manipulation infrastructure already exists.

---

## True Cross-Compatibility

Skeleton Key currently officially supports Linux and Android through Termux-based setups. Installation and update scripts are provided for these environments, and the current documentation assumes the user is operating on one of these supported platforms.

macOS and Windows will **NOT** be officially supported. I personally do not use either operating system and therefore do not intend to maintain, test, or provide dedicated installation instructions for them.

That does **not** necessarily mean Skeleton Key cannot run on those platforms.

### 1. Portable Architecture

Again, Skeleton Key is highly portable.

The framework is written in Node.js and is not inherently tied to its current terminal environments. It is completely feasible for an experienced user to read the existing documentation, adapt the installation process, and potentially run Skeleton Key on macOS or Windows.

Users may also be able to use AI-assisted troubleshooting to adapt the project to unsupported environments.

However, unofficial platform support comes with additional responsibility.

If you manually install Skeleton Key on another platform, you should carefully understand the installation and update process. When updating or migrating an installation, make sure you preserve important local data, including:

- The local account database
- The master key lock file
- User-generated payloads
- Backups
- Snapshots
- Downloaded assets

Unsupported environments may require manual intervention when the project changes.

---

### 2. iOS Limitations

iOS support is currently out of scope.

Based on the available lightweight Linux user-space environments for iOS, such as iSH, running the modern Node.js environment required by Skeleton Key is currently a significant limitation.

Node.js is a core component of Skeleton Key, which is written around a Node.js-based runtime and supporting dependency ecosystem.

Even if a sufficiently recent version of Node.js could be made available, additional limitations would remain. Skeleton Key relies on local filesystem behavior and SQLite-backed application data, and the type of Linux-like environment available on iOS would need to support the required runtime and filesystem functionality reliably.

This would likely require a significantly more capable user-space environment than what is currently practical for the project.

For these reasons, iOS support is not currently considered a realistic target.


---

## FRLMods to Skeleton Key

What does this mean you may be thinking?

FRLMods and other community sources provide livery codes shared through community uploads. These codes are a compact, user-facing representation of serialized livery data.

Skeleton Key's `codec.js` currently understands both the livery code format and the underlying serialized binary representation.

This means a compatible livery code can be processed through the codec, converted into usable binary livery data, applied to a compatible car object, and then injected directly into the garage or saved as a reusable car payload.

I created and tested a prototype of this functionality outside of Skeleton Key, and the underlying workflow works.

The primary limitation is currently the CLI interface.

### Current CLI Limitation

Some livery codes can contain large amounts of data.

Skeleton Key currently uses `readline` for interactive input, which is not ideal for reliably handling very large pasted livery codes. If a pasted code is incomplete or formatting is altered during input, the resulting livery data can become corrupted or invalid.

Because of this, directly pasting large livery codes into the current CLI is not considered a reliable implementation.

### Current Workflow

The current workflow for using a community livery generally requires finding the code on a website, copying it, opening FR Legends, selecting a compatible car, opening the livery menu, purchasing any required livery slots, and finally pasting the code.

That workflow could potentially be consolidated into something much simpler:

```text
Find code
Paste code into supported interface
Select compatible car model
Inject car or save as payload
```

### Possible CLI Implementation

Because the current terminal input system is not ideal for large pasted inputs, a feasible CLI implementation could use files instead.

The workflow could look like this:

```text
Find code
Paste code into a supported file
Open Skeleton Key
Select the livery code
Select compatible car model
Inject car or save as payload
```

This would allow Skeleton Key to process the code without relying on a large serialized string being pasted directly into an interactive terminal prompt.

### Alternative Interfaces

A web application, desktop application, or another interface capable of reliably handling large text inputs could make this workflow even simpler.

A user could paste a supported livery code directly into the interface, select a compatible vehicle model, and construct the completed car without manually moving files around.

The underlying Skeleton Key engine could handle processing the livery data and constructing the compatible car object while the interface handles user interaction.

### Future Consideration

A manual file-based implementation of this feature may be considered for Skeleton Key in the future, but it is not guaranteed.

The underlying codec and car construction workflow have already been demonstrated experimentally. The primary challenge is implementing an input workflow that is reliable and appropriate for the interface.

---
