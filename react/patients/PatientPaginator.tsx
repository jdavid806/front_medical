import React from 'react';

type PaginationProps = {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
};

export const PatientPaginator: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    return (
        <div className="paginator">
            <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => onPageChange(currentPage - 1)}>
                        &laquo;
                    </a>
                </li>
                {Array.from({ length: totalPages }, (_, page) => (
                    <li key={page + 1} className={`page-item ${page + 1 === currentPage ? 'active' : ''}`}>
                        <a className="page-link" href="#" onClick={() => onPageChange(page + 1)}>
                            {page + 1}
                        </a>
                    </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <a className="page-link" href="#" onClick={() => onPageChange(currentPage + 1)}>
                        &raquo;
                    </a>
                </li>
            </ul>
        </div>
    );
};

