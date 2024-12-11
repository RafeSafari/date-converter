declare module "stylis" {
  export function prefixer(context: number, content: string): string;
}

declare module "stylis-plugin-rtl" {
  const rtlPlugin: any;
  export default rtlPlugin;
}
