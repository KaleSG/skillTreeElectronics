# Skill-Tree Electronics

Welcome to Skill-Tree Electronics! This repository is dedicated to the creation of a novel learning platform to learn anything about electronics from the very basics, to disciplinary-specifics at a professional level.

## Dev Notes - Table of Contents
 * [Dev notes (11/1/2026)](https://github.com/KaleSG/skilltree-electronics#dev-notes-1112026)
    * ["Node" Organization Structure"](https://github.com/KaleSG/skilltree-electronics#skill-node-organization-structure)
        * [Determining learning pathway to a skill](https://github.com/KaleSG/skilltree-electronics#determining-a-path-to-a-skill)
        * [Data abstraction of categorical node trees as modified standard trees](https://github.com/KaleSG/skilltree-electronics#data-abstraction-of-categorical-node-trees-as-modified-standard-trees)
        * [Naming/Numbering Node Scheme](https://github.com/KaleSG/skilltree-electronics#namingnumbering-scheme) (Deprecated)
        * [Issues](https://github.com/KaleSG/skilltree-electronics#issues)
            - tldr; defined tree structure with nodes of different subclasses: Skill Nodes, Categorical nodes, Parallelized Nodes.
            - Need new naming scheme. Current scheme is not scalable and will result in non-static numbering systems. Plan to replace with simple incremental internal/url document ids where each node tracks its md contents via its static/unchanging id instead of using a numbering system. 
            - Ideated possible skill/lesson plan structure format.

## Why does this repository exist?
This repository exists because of a fundamental flaw in electronics and electrical engineering education and industry practices.

There are thousands of YouTube videos, written tutorials, technical articles, and applications reports scattered all across the internet. All of which, are free to use. However, there is very few places on the internet that consolidate these resources into an easily accessible format for brand new learners, who aren't already familiar with how to actually find the resources they need to learn.

As comprehensive as they are, textbooks and handbooks on learning electronics aren't free, and readily accessible. Nor are they very streamlined. As much as I'd love to just hand everyone a copy of The Art of Electronics by Paul Horowitz, that just isn't feasible due to copyright law, lol. 

This repository attempts to do something that hasn't been done before, at least within the EE field. Rather than an endless textbook and or video series, this repository aims to mirror a concept pulled from many rpg-style video games called a 'Skill Tree'. 

In these types of games, a skill-tree is a progressive node-network dashboard of skills one can learn from; However, they are restricted from learning any skill they want at any time. In order to gain a specific skill, they must fulfill the prerequisite skills prior to attempting to gain that skill itself. These networks are far from linear. Some skills require multiple pre-requisite skills way before jumping into the next one. Additionally, unlocking a certain skill also has the option of unlocking multiple skills that stem from that single, pre-requisite skill.

This repository intends to adapt the worlds complete knowledge of electrical engineering and electronics design into this skill-tree format. There are just too many subdisciplines and skills in electrical engineering to structure it in any other way. Its impossible to do power electronics well without first learning about electromagnetism, basic signal/frequency responses, PWM, and deeply understanding the mathematical equations of inductors and capacitors. There isn't a single, correct order to learn these prerequisite skills, so making a youtube series about learning electronics or having a textbook to teach one everything, doesn't make any sense. There is no linearity in learning electronics, and there can't be. 

This repository does its best to structure and organize everything you could possibly learn about electronics into a skill-tree format, where any person could simply select the skill they want to learn and be given a pathway to learn it. 

## Where is the content of this project coming from?
The content of the actual lessons of this project will come from online resources that this projects maintainers find to be as detailed and as accurate as possible. Additionally, the hope for this project is that resources from every discipline will come from the recommendation of experiences engineers in that discipline. I.E any lesson on embedded systems should and will be based on resources per the recommendations of an engineer with at least 5 years or more of experience within the embedded systems field.

The origin of these resources will be cited per lesson, so that learners can take advantage of the resources provided to us on their own, if they so choose. We will occasionally adapt textbooks and non-free material, but we will provide their ISBN's and will do our best to teach lessons from them in our own words.


# Dev Notes (11/1/2026)
These are just notes I am using to keep track of development, design decisions, and possible problems.


## "Skill Node" Organization Structure
![](<readme-assets/diagrams/Starting Concept.drawio.svg>)
This is the foundation of the skill-tree node model for learning electrical engineering. Pulled form RPG-style games and skill dashboards, the inherent structure is defined by skills requiring some number of prerequisite skills before learning a milestone/skill. 

Nodes in series inherently require its previously chained skill nodes to be completely before moving on with the new skill itself. Nodes in parallel are able to be done in any order and are not dependent on each other for completion. However, these nodes in parallel must both be completed, prior to moving on to the next series node/category node.

It will take very thorough look at the best ways to organize foundational skills into an order that makes sense, but regardless of said order, a skill tree seems to be the most appropriate format for this to take place.

### Determining a path to a skill
Inherently, this structure is an example of a tree in data abstractions:
![Tree Network](readme-assets/diagrams/tree-model.png)

In summary, a tree network is a collection of nodes, where there is a singular "root" node at the top of the tree. Each valid node has exactly 1 valid parent. Our model will be a tree-node model with un-restricted child nodes. I.E each node can have as many child nodes as it needs. 

The primary differentiator between the proposed skill tree structure and a standard skill tree is the modification of nested nodal prerequisites. In other words, to complete a skill-node in order to move on, a sub-skill-tree contained within a categorical node must be completed prior to being able to mark that categorical node as complete.


#### Data abstraction of categorical node trees as modified standard trees

**As a visual example:**
In the below diagram, each node has at most 1 parent, but contains its own internal skill-tree that must completed for the overall category to be considered completed. 

![](<readme-assets/diagrams/Data Strucure Tree.png>)

Parallel nodes within a categorical node can be thought of as their own categorical grouping of nodes with each parallel node being children of the node

![Hierarchical Coding](readme-assets/diagrams/name-scheme.png)

As a practical explanation of its use, lets say I want to learn parallel circuits. To get there, I have to first complete the prerequisite parallel nodes that make up kirchhoff's voltage and current laws. Those nodes still have their own prerequisites beyond them. The full path it would take to actually learn about parallel circuits is as follows:

[What are Electronics] -> [What is Electricity] -> [Electrical Quantities] -> ( Incomplete Governing Equations & Representation) -> [Kirchhoff's Voltage Law & Kirchhoff's Current Law] -> [Series/Parallel Circuits]

This flow can be seen in the diagram below. Highlighted nodes below represent the nodes that much be completed before attempting to learn about series/parallel circuits.



![Series Parallel Pathway](readme-assets/diagrams/series-parallel-pathway.png)
## Naming/Numbering Scheme

### Current Proposed naming scheme

Hierarchical Naming of Skill Nodes:
This skill node naming system consists of an arbitrary length string of integers with dashes in-between, representing category distinctions. Each category or lesson code should have a leading zero.

Ex. The following are all valid naming codes:

* 01, 02
* 01-01, 01-02
* 03-043-0143, 04-011-04

Each number grouping, to reiterate, classifies the category, subcategory, and specific lesson number within its category.

Incrementing integer lessons/skill nodes are dependent on the integer skill-node code before it..

I.E the skill/category 01 must be completed before 02;
01-03, must be completed prior to 01-04,
02-011-06 must be completed prior to 02-011-07.

Below is a visual example of the system:
![Hierarchical Coding](readme-assets/diagrams/name-scheme.png).

Prior to learning anything in the skill-node-group "03", both 01, and 02 must be completed first in that order. There isn't a restriction that disallows users to skip ahead, but it is recommended that they complete the prior nodes first.


## Issues


#### Issues with the current system - (11/1/26)
1.  Doesn't differentiate parallel learning requirements without strict order. For example, voltage and current can be learned without a specific order (Codes "03-02-01" and "03-02-02" a.r.e not dependent on each other, nor have a suggested order of reading). This leaves ambiguity with respect to prerequisites vs arbitrary learning order. 
    - this might not actually be that problematic since, even if a user chose to read in number order, they wouldn't be at a loss. Lessons should try and mirror this behavior, though. And avoid referencing voltage and current in the two documents respectively and should be treated as two independent concepts. Leave the effects on current by voltage for the section on power and IV curves, ideally. 
    - **Possible Solutions**:
        - Create a separation between 'Categorical Nodes" and "Parallel Nodes". These could possibly be grouped together with a base class of "Grouping Node".
            - Since parallel nodes are sometimes not actually categorized together, or have anything to with each other, but are both prerequisites to a future node, they fulfill a similar function to categorical nodes, but aren't the exact same thing. 
            We might be able to classify this distinction as an abstract class. Right now, the main node types would be considered as follows (tentative):
                * **Skill Node**
                    - These are nodes that actually have an associated lesson, and aren't just a classification.
                * **Categorical Node**
                    - Groups together a sub-skilltree within itself and cannot be marked completed until all nodes within the categorical sub-tree have been completed.
                * **Parallelized Node**
                    - A collection of nodes that have equal priority and can be completed in any order. The nodes inside the parallel node may be completely unrelated to each other, but serve a prerequisite for something else. As an abstract concept, this function similar to categorical nodes, as both must have their internal nodes completed, prior to being able to move on to the next topic. 
                    - Essentially treated as a singular node as seen by other nodes with 1 single parent node and any number of child nodes.
                    - Will contain an unordered collection of sub-nodes. A Parallelized Node should not have any sort of tree structure within it. This is the main distinction from a categorical node. Parallel nodes can have categorical nodes within them, but cannot have any form of tree structure within them.

2. Not directly scalable. This naming scheme does not account for changes we might want to make in the future to the actual learning pathway, if we decide a current ordering is insufficient or impractical.
    * This is honestly a huge draw back and is like the **#1** problem with this model. Will need to think of some alternatives.
   ** Solution**:
   - This is honestly a pretty easily problem to solve. Instead of forcing nodes to have order-locked ID's we can just assign each node its own id and leverage the node-like nature of the skilltree by tracking parent and children nodes (For all nodes) and tracking content files (md, images, etc) for skill nodes using static ids so they can easily be moved around and are only linked via previous and next nodes by their inherent data structure capabilities. Documents/Images/other content-related files could just be stored statically with incrementing ID's so no files can somehow accidentally get deleted or compromised when nodes move around during rearrangement          
    * **Considerations:**
        * Content should probably be organized in a structured and standardized way. I.E circuit diagrams should use the same style, symbols, titling/naming conventions etc. It would be nice to use latex for this but I don't know how fleshed out latex symbol gen is. tbh i'd rather use a symbol library and use libre draw or something and just use better gridding.
            - files organization should probably be per-skill. Images + associated files should be in the same folder as the lesson itself.
3. haven't thought about article structure yet. Not sure if I want lessons to be tabbed/have subchapters that are separately linked, or if I want it to just be 1 long form. Long form would probably be better for mobile, I think i'd rather stick to that and have a drop-down of a table of contents to jump to a section. This would probably be a huge bandwidth saver as well. I think at minimum articles should have the following in the following order:


    - Article/Skill Information
        - Article/Skill Name
        - Skill Date Added
        - Skill Date Modified
        - Skill Article Author Name

    - Table of Contents

   

    - Layman overview/description of what   the skill is/what the content is
        - Description can include functional definitions, and or common uses of the technology/of the skill; very dependent on the skill, though.
    
    - Auto-generated list of skills a reader should already have before attempting to learn the skill. This will leverage the nodal structure of the skilltree and just recursively traceback to the root of the entire learning tree to create a linear learning pathway (LLP) for the user to learn that subject from the beginning.
        - clicking on a link from the autogen list should bring the user to the associated article AND highlight the LLP of the prerequisite clicked upon.
            - This should probably be a method of a node to actually display the full highlighted path when a lesson is highlighted.
        New ideas:
            - Maybe when hovering over a node in the the skilltree view highlights the path + shows a preview of the overview/description. This might require systemizing/abstracting articles/skills further. Not terrible, just need to figure out a decent architecture.

    - Lesson Content
        
    - References/Citation list

    - Checking Understanding Problems (with answer verification)

    - Auto-generated next-skill list to quickly see what this skill unlocks.


4. How do we handle front-end generation to get the functionality we want? Theres a few options. We want the front end to be draggable so that the node tree is easy to navigate. I think the ideal format for the skill trees is have the view stay hierarchical so that users can simply drag and click on nodes they are interested in learning more about. I don't think having every single node on screen at the same time is really necessary. It'd be cool to for users to "jump in" to a category, though. 
- Parallel nodes should stay parallel and should not be able to be "jumped into". 
- At any given time, there will probably be no more than 100 nodes on the screen. I just dont see that ever happening, so an SVG/DOM element system might be the easier to do.
    **Implementation**
    - According to gemini, the best methodology for this would probably be using matrix transforms on svg/css elements. This is done using touch events and translation functionality built into DOM/CSS. 
    * Touch events: touchstart, touchmove, touchend (pretty straightforward)
    * using delta tracking on the positions from each event, we can just translate an inner canvas.

## Desired Site Features (Frontend)
 These are a list of features/considerations for the website itself that I might want to implement on the front end
 * Skill-Tree (The main concept)
    * Skill tree is the collection of learning nodes (Skill, Categorical,Parallel)
    * Users can hover skills to see a preview of what the skill is/a small conceptual image
    * Users can press on skill nodes to just/be redirected right to the learning page for that skill
* User Accounts
    * Users can either bookmark pages of interest in their browser, or make an account (email required)
    * Accounts are public so others can see your progress/saves/bookmarks
        - This should encourage users to keep on going as a form of public acknowledgement that they are making progress. 
        - Ideally, this becomes a place where engineers can prove their knowledge of their domain and can eventually become a place used by both individuals and companies to verify skill levels or for training their own employees.
            - This feature could open up room for industry sponsorship that can help the mission keep going. If companies are willing to pay for the resources we make, in addition to open-sourcing those same resources, this could become a non-profit organization that is funded by companies that need us to prepare the new work force by making electrical knowledge more concrete. 
* Account Flags
    * User accounts can have certain account flags that give them permissions to do certain things
    - Seedling (new users)
        - Full access to all skill-tree lessons, bookmark capabilities, article download capabilities, forum reading capabilities. Seedlings cannot post on the forum, yet.
        - Users without accounts cannot download articles, but can read them freely.
            - Users can always download the full repository of articles on github.
            - Anti-Spam features
                - Kicking IPs after concurrent account creations, restrict account creation from both public and private. Limit account creation to 1 account per k minutes per ip.
                - For DDOS protection, Restrict general account creation to 1 account per k minutes. Its not expected, at least initially, that the site will be insanely popular. Need to consult some cybersecurity experts later about this.
    - Harvester (At least 10 hours spent on the website)
        - Harvesters are users who have spent substantial time on the platform. This allows them to begin making forum posts, answer questions on the forum
    - Gardener (Technical Article Writer/Contributor)
    - Farmer (Skill-tree manager)
    - 
* Forum - Creating a public forum with volunteer moderation from engineers can help new engineers and experienced engineers alike look for assistance in a centralized place where people are already looking for support in their learning. The goal of this feature is to encourage collaboration and community within the global space. Modeling after something like EEVblog, IRC chats, Reddit, and even slack/discord could open up opportunity for community members to thrive.
    - Questions about who is moderating whom still need to be answered. I'm expecting this to ramp up fast, so answering this is important

## MVP
- Current MVP
Functionally:
    - Full skill tree with starting learning nodes and dedicated urls for each learning page (Click to Route)
    - Standardized format for skill nodes/articles
        - Autogen for prerequisite/post-requisite materials
    - Pathway highlighting and generation for learning paths
    - Path naming: root to node full path on articles 
**Backend**
*Data Representation*
- Categorical node tree representation of subtree
- Leaf/Node parameters for each skill/categorical/parallel node
    - Parent Node (Prerequisite)
    - Children Nodes (Future Skills)
*Data Serving*
- Choose data-efficient format for sending pre-compiled tree network to client
- Create data serving to client on connection
**Frontend**
- Draggable display and pop-up lessons with custom links for sharing/bookmarking.
- Pathway highlighting on hover, description on hover (with placeholder image)
- Article format for on-click.