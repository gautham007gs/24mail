declare module 'react-helmet' {
  import { ReactNode } from 'react';
  
  interface HelmetProps {
    children?: ReactNode;
    defer?: boolean;
    encodeSpecialCharacters?: boolean;
    onChangeClientState?: (newState: any, addedTags: any, removedTags: any) => void;
    titleTemplate?: string;
    defaultTitle?: string;
    base?: any;
    link?: any[];
    meta?: any[];
    noscript?: any[];
    script?: any[];
    style?: any[];
    title?: string;
    htmlAttributes?: any;
    bodyAttributes?: any;
  }

  export class Helmet extends React.Component<HelmetProps, any> {}
  
  interface HelmetData {
    base: any;
    bodyAttributes: any;
    htmlAttributes: any;
    link: any[];
    meta: any[];
    noscript: any[];
    script: any[];
    style: any[];
    title: any;
  }

  export function useHelmet(): HelmetData;
}
