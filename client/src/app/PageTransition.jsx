import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const Screen = ({ children }) => <div className="ww-page">{children}</div>;

Screen.propTypes = { children: PropTypes.node.isRequired };

/**
 * Barba-style page transition: instead of a hard cut, every screen fades
 * and rises gently into place (see `.ww-page` in index.css) and a new
 * screen always starts at the top of the page.
 */
const PageTransition = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return <Screen key={pathname}>{children}</Screen>;
};

PageTransition.propTypes = { children: PropTypes.node.isRequired };

export default PageTransition;
