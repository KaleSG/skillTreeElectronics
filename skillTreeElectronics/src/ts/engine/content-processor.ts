import { styleText } from "node:util";

interface NodeFrontmatter {
  id: string;
  name: string;
  description?: string;
  childrenIds?: Set<string>;
  categoricalRootIds?: Set<string>;
}

const extractedNodeData = import.meta.glob<NodeFrontmatter>(
  "/src/learning-content/**/*.mdx",
  {
    eager: true,
    import: "frontmatter",
  },
);

// Can represent either a classic skill node or a categorical node, dependent on _categoricalRootIds
class TreeNode {
  // These prevent double id initialization
  static #nodesById: Record<string, TreeNode> = {};
  static #nodeParentIdById: Record<string, string> = {}; //Reverse loop up table after initial parsing
  static #nodeCategoricalParentIdById: Record<string, string> = {}; // Only applies to root nodes in categorical nodes

  //Gets the associated Node object from its id
  static getNodeById(id: string): TreeNode | undefined {
    if (this.#nodesById[id] !== undefined) {
      return this.#nodesById[id];
    } else {
      return undefined;
    }
  }

  static getAllNodesById(): Record<string, TreeNode> {
    return this.#nodesById;
  }

  static getParentNodesById(): Record<string, string> {
    return this.#nodeParentIdById;
  }

  /* Validation functions */

  // Returns an array of node IDs from list of initialized nodes that don't have a parent
  static getOrphanNodeIds() {
    return Object.keys(this.#nodesById).filter(
      (id) => !Object.hasOwn(this.#nodeParentIdById, id) && !Object.hasOwn(this.#nodeCategoricalParentIdById, id),
    );
  }

  // Returns an array of node IDs that are specificed as children but don't actually exist
  static getFakeChildrenIds() {
    return Object.keys(this.#nodeParentIdById).filter((id) =>
      !Object.hasOwn(this.#nodesById, id),
    );
  }

   static getFakeCategoryRootIds() {
    return Object.keys(this.#nodeCategoricalParentIdById).filter((id) =>
      !Object.hasOwn(Object.keys(this.#nodesById), id),
    );
   }
  

  #id: string;
  #name: string;
  #description: string;
  #childrenIds: Set<string>;
  #categoricalRootIds: Set<string>;
  #path: string;

  constructor(
    id: string,
    name: string,
    path: string,
    description: string = "",
    childrenIds: Set<string> = new Set<string>([]),
    categoricalRootIds: Set<string> = new Set<string>([]),
  ) {
    this.#id = id;
    this.#name = name;
    this.#path = path;
    this.#description = description;
    this.#childrenIds = childrenIds;
    this.#categoricalRootIds = categoricalRootIds;

    if (Object.hasOwn(TreeNode.#nodesById, id)) {
      throw new Error(
        "Cannot Initialize, more than one node initialized with id: \'" +
          id +
          "\' at path: " +
          this.#path,
      );
    }

    TreeNode.#nodesById[id] = this;

    // Index all children and create reverse parent look up table in #nodeParentIdbyId
    for (const childNodeId of childrenIds) {
      if (Object.hasOwn(TreeNode.#nodeParentIdById, childNodeId)) {
        throw new Error(
          "Cannot initialize node id: " +
            id +
            ", More than 1 parent exists for node with id: " +
            childNodeId +
            ". " +
            "\' at path: " +
            this.#path,
        );
      } else {
        TreeNode.#nodeParentIdById[childNodeId] = id;
      }
    }

    //Index all Categorical Root Node Ids and create reverse parent look up table
    for (const categoricalRootId of categoricalRootIds) {
      if (Object.hasOwn(TreeNode.#nodeCategoricalParentIdById, categoricalRootId)) {
        throw new Error(
          "Cannot initialize root node id: " +
            id +
            ", More than 1 categorical parent exists for node with id: \'" +
            categoricalRootId +
            "" +
            "\' at path: " +
            this.#path,
        );
      } else {
        TreeNode.#nodeCategoricalParentIdById[categoricalRootId] = id;
      }
    }
  }

  //  Public Methods

  // returns true if the current TreeNode object has a non-empty parentId, false if otherwise
  hasParent(): boolean {
    return Object.hasOwn(TreeNode.#nodeParentIdById, this.#id);
  }

  //returns false if the current TreeNode object has a non-empty parentId, true if otherwise
  isOrphan(): boolean {
    return !this.hasParent();
  }

  hasChildren(): boolean {
    return !(this.#childrenIds.size === 0);
  }

  hasCategoricalParent(): boolean {
    return Object.hasOwn(TreeNode.#nodeCategoricalParentIdById, this.#id);
  }

  /* Public Accessors */

  // metadata accessors
  get name() {
    return this.#name;
  }

  get id() {
    return this.#id;
  }
  get description() {
    return this.#description;
  }

  // family-getters
  get parentNodeId(): string | undefined {
    if (this.hasParent()) {
      return TreeNode.#nodeParentIdById[this.#id];
    } else {
      return undefined;
    }
  }

  get parentNode() {
    if (this.parentNodeId != undefined) {
      return TreeNode.getNodeById(this.parentNodeId);
    } else {
      throw Error(
        "Cannot call get parentNode() on node, node with id: \'" +
          this.#id +
          "\' does not have an initialized parent node",
      );
    }
  }

  get childrenIds(): Set<string> {
    return new Set(this.#childrenIds);
  }

  get childrenNodes(): Set<TreeNode> {
    const children = new Set<TreeNode>();
    for (const childId of this.#childrenIds) {
      const childNode = TreeNode.getNodeById(childId);
      if (childNode != undefined) {
        children.add(childNode);
      } else {
        console.warn(
          styleText(
            "yellow",
            "attempted to access child node id: '" +
              childId +
              "\' from parent node id: " +
              this.#id +
              " , but child node does not exist.",
          ),
        );
      }
    }

    return children;
  }

  get categoricalParentId(): string | undefined {
    if (this.hasCategoricalParent()) {
      return TreeNode.#nodeCategoricalParentIdById[this.#id];
    } else {
      return undefined;
    }
  }

  get categoricalParentNode(): TreeNode | undefined {
      if (this.categoricalParentId != undefined) {
        return TreeNode.getNodeById(this.categoricalParentId);
    } else {
      throw Error(
        "Cannot call get categoricalParentNode() on node, node with id: \'" +
          this.#id +
          "\' does not have an initialized categorical parent node",
      );
    }
  }

  get categoricalRootIds(): Set<string> {
    return this.categoricalRootIds;
  }

  get categoricalRootNodes(): Set<TreeNode> {
    const categoricalRoots = new Set<TreeNode>();
    for (const categoricalRootId of this.#categoricalRootIds) {
      const categoricalRootNode = TreeNode.getNodeById(categoricalRootId);
      if (categoricalRootNode != undefined) {
        categoricalRoots.add(categoricalRootNode);
      } else {
        console.warn(
          styleText(
            "yellow",
            "attempted to access categorical root id: '" +
              categoricalRootId +
              "\' from categoical parent node id: " +
              this.#id +
              " , but root id node does not exist.",
          ),
        );
      }
    }

    return categoricalRoots;
  }

  get path(): string {
    return this.#path;
  }
}

// Initialize TreeNodes from extracted Data
Object.keys(extractedNodeData).forEach((path) => {
  const nodeMetaData: NodeFrontmatter = extractedNodeData[path];
  const node: TreeNode = new TreeNode(
    nodeMetaData.id,
    nodeMetaData.name,
    path,
    nodeMetaData.description,
    nodeMetaData.childrenIds,
    nodeMetaData.categoricalRootIds,
  );
});

console.log("fake children");
console.log(TreeNode.getFakeChildrenIds());
console.log("orphans");

console.log(TreeNode.getOrphanNodeIds());
console.log("fake categorical roots");
console.log(TreeNode.getFakeCategoryRootIds());