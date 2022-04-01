import {memo, useEffect, useRef, useState} from 'react';
import {Light as SyntaxHighlighter} from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import json from 'react-syntax-highlighter/dist/cjs/languages/hljs/json';
import markdown from 'react-syntax-highlighter/dist/cjs/languages/hljs/markdown';
import rust from 'react-syntax-highlighter/dist/cjs/languages/hljs/rust';
import java from 'react-syntax-highlighter/dist/cjs/languages/hljs/java';
import atomOneDark from 'react-syntax-highlighter/dist/cjs/styles/hljs/atom-one-dark';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Button, Image, Input, Space} from 'antd';
import '../assets/style/blogEditor.scss';
import TextArea from 'antd/es/input/TextArea';

SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('java', java);
const components = {
 code({node, inline, className, children, ...props}) {
  let match = /language-(\w+)/.exec(className || '');
  match = match === null ? ['x', 'js'] : match;
  return (
      <SyntaxHighlighter
          style={atomOneDark}
          customStyle={{}}
          showLineNumbers={true}
          language={match[1]}
          PreTag="div"
          children={children}
          {...props}
      />
  );
 },
 td({children}) {
  return <td style={{borderLeft: '1px solid black', borderRight: '1px solid black'}}>{children}</td>;
 },
 tr({children, ...props}) {
  return <tr style={{borderTop: '1px solid black', borderBottom: '1px solid black'}}>{children}</tr>;
 },
 th({children, style, ...props}) {
  return <th style={{borderLeft: '1px solid black', borderRight: '1px solid black', ...style}}>{children}</th>;
 },
 img({...props}) {
  let splits = props.src.split('/');
  splits[splits.length - 1] = `gzip_${splits[splits.length - 1]}`;
  let all = splits.join('/');
  return (
      <div style={{overflow: 'hidden'}}>
       <Image
           style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
           }}
           src={all}
           alt={props.alt}
           preview={{
            src: props.src,
           }}
       />
      </div>
  );
 },
 h1({...props}) {
  return <h1 style={{fontWeight: 700}}>{props.children}</h1>;
 },
};

export default memo(function ({content, setContent}) {
 const ref = useRef('');
 useEffect(() => {
  ref.current.resizableTextArea.textArea.value = content;
 }, [content]);

 function editMd(e) {
  setContent(e.target.value);
 }
 return (
     <>
      <div className={'edit-container'}>
       <div className={'editor-container'}>
        <TextArea showCount defaultValue={content} onChange={editMd} ref={ref}/>
       </div>
       <div className={'markdown-container'}>
        <ReactMarkdown children={content} components={components} remarkPlugins={[remarkGfm]}/>
       </div>
      </div>
     </>
 );
});
