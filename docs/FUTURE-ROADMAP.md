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

## Other Miscellaneous Ideas

I've covered most of the larger ideas I can currently think of. Here are a few smaller possibilities that may or may not be added, but are worth mentioning nonetheless.

### 1. Paint Modifications

Inside a car object, paint data for the car body, roll cage, and engine hose can look something like this:

```json
"color": {
    "matType": 0,
    "matPath": "CarPaintDefault.mat",
    "body": {
        "r": 119,
        "g": 55,
        "b": 185,
        "a": 255
    },
    "hose": {
        "r": 32,
        "g": 191,
        "b": 223,
        "a": 255
    },
    "rollGage": {
        "r": 32,
        "g": 191,
        "b": 223,
        "a": 255
    }
}
```

These values can be manipulated, making it possible to create a dedicated interface for modifying vehicle colors.

I have already experimented with unusual color values and effects such as attempting to create invisible cars, but I have not uncovered anything particularly interesting.

I'm not certain whether this feature is worth adding because it does not currently provide functionality that cannot already be performed easily in-game. There is also no visual preview inside the CLI.

However, it is completely feasible, and Skeleton Key already contains multiple examples of direct account and car-object modification through structured save data.

---

### 2. Engine / Suspension Modifications

This is similar to the paint modification possibilities because many of these settings can already be changed through normal gameplay.

From my testing, the game appears to validate important engine and suspension values server-side. This limits how far these modifications can be pushed beyond supported game configurations.

That does not mean the fields are useless. Skeleton Key could still provide stock engine and suspension presets or simplify applying supported configurations.

Unfortunately, no `9999999hp` engines. Sorry. :)

Here is an example of what these fields can look like inside a car object:

```json
"config": {
    "height": -1,
    "balance": 0,
    "camberF": 18,
    "camberR": 18,
    "flangeF": 0.011934160254895687,
    "flangeR": 0
},
"engine": {
    "engineName": "1JZ",
    "path": "_Engines/1JZ.prefab",
    "rpmMin": 1000,
    "rpmMax": 8500,
    "torque": 716.7999877929688,
    "torqueMax": 716.7999877929688,
    "torqueLimit": 800,
    "mass": 160,
    "torqueBase": 515,
    "engineLevel": 5,
    "camshaftsLevel": 5,
    "transmissionLevel": 5,
    "ecuLevel": 5,
    "turboRatio": 1,
    "intakeKit": {
        "path": "_Engines/1JZ_KIT1.prefab",
        "AFLevel": 5,
        "HSLevel": 5,
        "ICLevel": 5,
        "TurboLevel": 5
    }
}
```

---

### 3. Unlocked Track Modifications

This is potentially more useful than the previous two options, although there are still some caveats.

Personally, I have not mapped every track value, so I cannot currently provide a complete track mapping. However, the field itself appears straightforward to research through controlled comparison.

A possible workflow would be:

- Check which tracks are currently unlocked
- Inspect the current account JSON data
- Record the values inside `unlockedTracks`
- Unlock one additional track normally
- Compare the modified save data
- Repeat the process
- Test the identified values on a separate account

Once the complete mapping is understood and verified, the process could theoretically be turned into a simple interface where users select a supported track and Skeleton Key applies the corresponding account data.

Here is an example of what the field can look like:

```json
"unlockedTracks": [
    4,
    20,
    16,
    5,
    10,
    24,
    6,
    13
]
```

This is more of a convenience feature than a necessary one, but it remains a possible addition.

---

### 4. Inventory Modifications

This one is worth mentioning because inventory ownership appears to be represented inside the structured account data.

Theoretically, modifying the relevant inventory data could allow items such as supported vehicle components or body parts to be added to an account's inventory.

However, I currently do not consider this a high-priority feature. It would require additional mapping and testing, while much of the project's existing functionality already provides more direct ways to construct and manage vehicles.

This functionality would involve modifying the `inventory` field inside the structured account save data.

---

### 5. Score Record Modifications

I have not fully tested this possibility and cannot verify whether modified score records are accepted by the server.

However, the account data contains score-record fields which may theoretically be editable.

For example, values such as `-1` appear to represent records that have not been achieved.

Here is an example of what part of the field can look like inside an account save:

```json
"scoreRecords": {
    "tougev2_seconds": [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        46.1971549987793
    ],
    "gymk_scores": [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        26.399999618530273
    ]
}
```

Whether modified values are accepted, displayed, or retained by the game would require additional testing.

---

### 6. Miscellaneous Fields

There are several additional fields I have not investigated deeply enough to justify dedicated features.

Possible areas for experimentation include:

- Special offers
- Car damage
- `defaultLevelDifficulty`
- `defaultFreeRunAINumbers`
- Other account and gameplay configuration fields

These are some of the final areas I can currently identify for potential experimentation.

Realistically, I do not expect every editable field to produce a useful Skeleton Key feature. Some values may simply be validated, overwritten, ignored, or provide functionality that is already easily available through normal gameplay.

Still, one of the interesting aspects of working with structured account data is that there is always room for additional experimentation.

---

## Conclusion

