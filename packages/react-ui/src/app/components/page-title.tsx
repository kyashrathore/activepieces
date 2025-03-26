import { useEffect } from 'react';



type PageTitleProps = {
  title: string;
  children: React.ReactNode;
};

const PageTitle = ({ title, children }: PageTitleProps) => {

  useEffect(() => {
    document.title = `${title}`;
  }, [title]);

  return children;
};

PageTitle.displayName = 'PageTitle';

export { PageTitle };
