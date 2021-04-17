import React from 'react'

// pass in props from state in the Giphy jsx file
const Paginate = props => {
    const pageNumbers = [];
    // Math.ceil will round up in the event that your page numbers can be divided evenly
    for(let i = 1; i <= Math.ceil(props.totalItems / props.itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return ( 
    <nav>
        <ul className="pagination pagination-sm justify-content-end border-0">
            {pageNumbers.map(number => {
                let classes = "page-item ";
                if (number === props.currentPage) {
                    classes += "active";
                }
                
                return (
                    <li className={classes}>
                        <a 
                        onClick={() => props.pageSelected(number)} 
                        href="!#" 
                        className="page-link"
                        >
                            {number}
                        </a>
                    </li>
                );
            })}
        </ul>
    </nav>
    );
};

export default Paginate;