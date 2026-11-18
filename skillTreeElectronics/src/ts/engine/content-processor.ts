const extractedNodeData = import.meta.glob("/src/learning-content/**/*.mdx", {
  eager: true,
  import: "frontmatter",
});

interface Node {
  id: string;
  name: string;
  description: string;
  path: string;

  childrenIds: string[];

  isCategorical: boolean;
  categoricalRootIds: string[];
}

interface CategoricalNode extends Node {
  nodeById: Record<string, Node>;
}


// Creates dictionary of nodes indexed by id, with path set to the file key
const globalNodesById: Record<string, Node> = Object.fromEntries(
  Object.entries(extractedNodeData).map(([path, node]) => [
    (node as Node).id,
    { ...(node as Node), path: path.replace("src/learning-content/", "").replace(/^\/+/, "") },
  ])
);




