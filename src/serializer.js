import css from 'css';
import { renderToString } from 'fela-tools';

function getNodes(node, nodes = []) {
    if (node.children) {
        node.children.forEach(child => getNodes(child, nodes));
    }

    if (typeof node === 'object') {
        nodes.push(node);
    }

    return nodes;
}

function markNodes(nodes) {
    nodes.forEach(node => {
        node.withStyles = true;
    });
}

function getSelectors(nodes) {
    return nodes.reduce((selectors, node) => getSelectorsFromProps(selectors, node.props), []);
}

function getSelectorsFromProps(selectors, props) {
    const className = props.className || props.class;
    if (className) {
        selectors = selectors.concat(className.toString().split(' ').map(cn => `.${cn}`));
    }
    const dataProps = Object.keys(props).reduce((dProps, key) => {
        if (key.startsWith('data-')) {
            dProps.push(`[${key}]`);
        }
        return dProps;
    }, []);
    if (dataProps.length) {
        selectors = selectors.concat(dataProps);
    }
    return selectors;
}

function getStyles(nodeSelectors, styleSheet) {
    const ast = css.parse(styleSheet);
    const rules = ast.stylesheet.rules.filter(filter);
    const mediaQueries = getMediaQueries(ast, filter);

    ast.stylesheet.rules = [...rules, ...mediaQueries];

    const ret = css.stringify(ast);
    return ret;

    function filter(rule) {
        if (rule.type === 'rule') {
            return rule.selectors.some(selector => {
                const baseSelector = selector.split(/:| /)[0].split('>')[0];
                return nodeSelectors.includes(baseSelector);
            });
        }
        return false;
    }
}

function getMediaQueries(ast, filter) {
    return ast.stylesheet.rules
        .filter(rule => rule.type === 'media' || rule.type === 'supports')
        .reduce((acc, mediaQuery) => {
            mediaQuery.rules = mediaQuery.rules.filter(filter);

            if (mediaQuery.rules.length) {
                return acc.concat(mediaQuery);
            }

            return acc;
        }, []);
}

const createSerializer = felaRenderer => {
    return {
        test: val => {
            return val && !val.withStyles && val.$$typeof === Symbol.for('react.test.json');
        },
        print: (val, print) => {
            const nodes = getNodes(val);
            markNodes(nodes);
            const selectors = getSelectors(nodes);

            const code = print(val);
            const style = getStyles(selectors, renderToString(felaRenderer));
            let result = `${style}${style ? '\n\n' : ''}${code}`;

            return result;
        },
    };
};
module.exports = createSerializer;
