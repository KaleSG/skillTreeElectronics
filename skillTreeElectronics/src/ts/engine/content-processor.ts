import { error } from "node:console";

const extractedNodeData = import.meta.glob("/src/learning-content/**/*.mdx", {
  eager: true,
  import: "frontmatter",
});

// Configurations
const skillTreeTrueRootId = 'templateNode';

interface TreeNode {
  id: string;
  name: string;
  description: string;
  path: string;

  childrenIds: string[];

  isCategorical: boolean;
  categoricalRootIds: string[];
}

interface CategoricalNode extends TreeNode {
  containedNodeIds: string[];
}

// Creates dictionary of nodes indexed by id, with path set to the file key
const globalNodesById: Record<string, TreeNode> = Object.fromEntries(
  Object.entries(extractedNodeData).map(([path, node]) => [
    (node as TreeNode).id,
    { ...(node as TreeNode), path: path.replace("src/learning-content/", "").replace(/^\/+/, "") },
  ])
)


//helper functions
function globalNodeExistsFromId(id: string) {
  return Object.hasOwn(globalNodesById, id)
}

export function getGlobalNodeFromId(id: string) {
  if (globalNodeExistsFromId(id)) {
    return globalNodesById[id];
  } else {
    throw error("Node with id "+ id+ " does not exist")
  }
}

function validateNoRecursion(rootId: string, collection: Record<string, TreeNode>) {

  const visited = new Set<string>();
  const toBeVisited: string[] = [rootId];
}


