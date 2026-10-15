import ReactPaginate from 'react-paginate'
function Pagination ({pages, changePage}) {
    return(
        <>
        <nav aria-label="Page navigation example">
            <ReactPaginate
                nextLabel="Next >"
                previousLabel="< Prev"
                // disini untuk batesin berapa tombol yg akan mucul
                pageCount={Math.min(5, pages)}
                onPageChange={changePage}
                containerClassName="pagination justify-content-center"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                activeClassName="active"
                disabledClassName="disabled"
            />
        </nav>
        </>
    )
}

export default Pagination