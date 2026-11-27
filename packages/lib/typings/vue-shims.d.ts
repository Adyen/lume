declare module '*.vue?raw' {
  const content: string;
  export default content;
}

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare const __VUE_VERSION__: 2 | 3;
