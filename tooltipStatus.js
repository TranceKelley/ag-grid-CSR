import React, { useMemo } from 'react';

export default (props) => {
  const data = useMemo(
    () => props.api.getDisplayedRowAtIndex(props.rowIndex).data,
    []
  );

  return (
    <div
      className="custom-tooltip"
      style={{ backgroundColor: props.color || 'white' }}
    >
      <p>
        <span>RO Status</span>
      </p>
      <p>
        <span>Tech Status: </span> {data.TechStatus}
      </p>
      <p>
        <span>Parts Status: </span> {data.PartsStatus}
      </p>
    </div>
  );
};
