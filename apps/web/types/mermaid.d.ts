declare module "mermaid" {
  interface MermaidRenderOutput {
    svg: string;
    bindFunctions?: (element: Element) => void;
  }

  interface MermaidApi {
    initialize: (config: unknown) => void;
    render: (id: string, text: string) => Promise<MermaidRenderOutput>;
  }

  const mermaid: MermaidApi;

  export default mermaid;
}
