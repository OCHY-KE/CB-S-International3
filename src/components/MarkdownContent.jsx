import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import styles from '../styles/MarkdownContent.module.css';

const MarkdownContent = ({ children, className = '' }) => (
  <div className={`${styles.content} ${className}`.trim()}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        br: () => <br />
      }}
    >
      {children || ''}
    </ReactMarkdown>
  </div>
);

export default MarkdownContent;