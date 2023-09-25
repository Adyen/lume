declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}
