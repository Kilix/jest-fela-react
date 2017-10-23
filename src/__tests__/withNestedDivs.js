import React from 'react';
import { createComponent, Provider } from 'react-fela';
import { createRenderer } from 'fela';
import renderer from 'react-test-renderer';
import monolithic from 'fela-monolithic';

import createSerializer from '../serializer';

const Text = createComponent(() => ({ color: 'red', fontSize: '16px' }));

const felaRenderer = createRenderer({ enhancers: [monolithic()] });
expect.addSnapshotSerializer(createSerializer(felaRenderer));

it('with-nested-divs', () => {
    const tree = renderer
        .create(
            <Provider renderer={felaRenderer}>
                <div>
                    <Text>Hello World</Text>
                </div>
            </Provider>,
        )
        .toJSON();

    expect(tree).toMatchSnapshot();
});
