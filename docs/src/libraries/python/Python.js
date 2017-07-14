import React, { PropTypes } from 'react';

import { Table } from 'linode-components/tables';
import { LinkCell } from 'linode-components/tables/cells';


export default function Python(props) {
  const { route } = props;
  const { pythonDataObjects } = route;
  const { pythonClientObjectTitles, pythonAPITitles } = pythonDataObjects;

  return (
    <section className="Article">
      <div className="EndpointIndex-header">
        <h1>Python Library</h1>
      </div>
      <div className="EndpointIndex-group">
        <h3>Client Objects</h3>
        <Table
          className="Table--secondary"
          columns={[
            {
              cellComponent: LinkCell,
              textKey: 'path',
              label: 'Object',
              headerClassName: 'SectionColumn',
              hrefFn: function (subPage) {
                return subPage.href;
              },
            },
            { label: 'Description', dataKey: 'description' },
          ]}
          data={[
            ...pythonClientObjectTitles,
          ]}
        />
      </div>
      <div className="EndpointIndex-group">
        <h3>API Objects</h3>
        <Table
          className="Table--secondary"
          columns={[
            {
              cellComponent: LinkCell,
              textKey: 'path',
              label: 'Object',
              headerClassName: 'SectionColumn',
              hrefFn: function (subPage) {
                return subPage.href;
              },
            },
            { label: 'Description', dataKey: 'description' },
          ]}
          data={[
            ...pythonAPITitles,
          ]}
        />
      </div>
    </section>
  );
}

Python.propTypes = {
  route: PropTypes.object,
};
