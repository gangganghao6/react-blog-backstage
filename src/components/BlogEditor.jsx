import {memo, useEffect, useRef} from 'react';
import {PrismLight as SyntaxHighlighter} from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown';
import rust from 'react-syntax-highlighter/dist/cjs/languages/prism/rust';
import java from 'react-syntax-highlighter/dist/cjs/languages/prism/java';
import c from 'react-syntax-highlighter/dist/cjs/languages/prism/c';
import cpp from 'react-syntax-highlighter/dist/cjs/languages/prism/cpp';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css';
import dart from 'react-syntax-highlighter/dist/cjs/languages/prism/dart';
import ejs from 'react-syntax-highlighter/dist/cjs/languages/prism/ejs';
import go from 'react-syntax-highlighter/dist/cjs/languages/prism/go';
import kotlin from 'react-syntax-highlighter/dist/cjs/languages/prism/kotlin';
import less from 'react-syntax-highlighter/dist/cjs/languages/prism/less';
import nginx from 'react-syntax-highlighter/dist/cjs/languages/prism/nginx';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
import ruby from 'react-syntax-highlighter/dist/cjs/languages/prism/ruby';
import sass from 'react-syntax-highlighter/dist/cjs/languages/prism/sass';
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
import sql from 'react-syntax-highlighter/dist/cjs/languages/prism/sql';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import wasm from 'react-syntax-highlighter/dist/cjs/languages/prism/wasm';

import atomOneDark from 'react-syntax-highlighter/dist/cjs/styles/prism/one-dark';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Image} from 'antd';
import '../assets/style/blogEditor.scss';
import TextArea from 'antd/es/input/TextArea';

SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('rust', rust);
SyntaxHighlighter.registerLanguage('java', java);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('dart', dart);
SyntaxHighlighter.registerLanguage('ejs', ejs);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('kotlin', kotlin);
SyntaxHighlighter.registerLanguage('less', less);
SyntaxHighlighter.registerLanguage('nginx', nginx);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('ruby', ruby);
SyntaxHighlighter.registerLanguage('sass', sass);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('wasm', wasm);

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
  splits[splits.length - 1] = `gzip_${splits[splits.length - 1]}.webp`;
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
 li({...props}) {
  return <li children={props.children} style={{listStyle: 'initial',marginLeft:'20px'}}/>;
 }
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
