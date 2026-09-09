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

3. You can move liveries across car models and have them sized perfectly. If you don't want to program a blender clone like #2, this could hypothetically be achieved from scripting livery manipulation, then trial-and-error checking repeatedly in-game to see if you can get the perfect translation across car models. This is also high effort, and would have to be repeated across all the car models in the game, but another cool possibility even if tedious. 


There is more like image to binary etc, but that I have not tested or speculated about. I have seen an example such as on frlmods.com but in my opinion and others, its very primitive.

---

## Hex Bodyshop


