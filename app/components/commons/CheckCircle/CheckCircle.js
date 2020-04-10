import React, { Component } from 'react';

type Props = { dimension: number };

class CheckCircle extends Component {
  props: Props;

  render() {
    const { dimension } = this.props;
    return (
      <>
        <svg
          className="bi bi-check-circle"
          width={`${dimension}px`}
          height={`${dimension}px`}
          viewBox="0 0 16 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M15.354 2.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3-3a.5.5 0 11.708-.708L8 9.293l6.646-6.647a.5.5 0 01.708 0z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            d="M8 2.5A5.5 5.5 0 1013.5 8a.5.5 0 011 0 6.5 6.5 0 11-3.25-5.63.5.5 0 11-.5.865A5.472 5.472 0 008 2.5z"
            clipRule="evenodd"
          />
        </svg>
      </>
    );
  }
}

export default CheckCircle;
