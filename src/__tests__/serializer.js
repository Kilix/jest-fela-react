import React from 'react';
import { createComponent, Provider } from 'react-fela';
import { createRenderer } from 'fela';
import renderer from 'react-test-renderer';
import monolithic from 'fela-monolithic';

import createSerializer from '../serializer';

const Text = createComponent(() => ({ color: 'red', fontSize: '16px' }));
const Wrapper = createComponent(() => ({
    border: 'solid 1px black',
    '> div': {
        fontWeight: 500,
    },
}));

const felaRenderer = createRenderer({ enhancers: [monolithic()] });
expect.addSnapshotSerializer(createSerializer(felaRenderer));

it('react-test-renderer', () => {
    const tree = renderer
        .create(
            <Provider renderer={felaRenderer}>
                <Wrapper>
                    <Text>Hello World</Text>
                </Wrapper>
            </Provider>,
        )
        .toJSON();

    expect(tree).toMatchSnapshot();
});
