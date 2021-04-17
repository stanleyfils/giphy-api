import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Loader from './Loading'
import '../app.css';
import Paginate from './Paginate';



const Giphy = () => {
    // set the state
    // gif state
    const [gifs, setGifs] = useState([])
    // gif form search state
    const [search, setSearch] = useState()
    // loading spinner state
    const [isLoading, setIsLoading] = useState(false)
    // set state for errors
    const [isError, setIsError] = useState(false)
    // pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(25)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem =indexOfLastItem - itemsPerPage
    // rendering currentItems allows us to see only the gifs stored on that specific page
    const currentItems = gifs.slice(indexOfFirstItem, indexOfLastItem)
    // you don't need state for items per page unless you want to give the user the option to choose how many items to display per page, which would triggert a re-render of your application.

    // page 1, item 1 - item 25
    // page 2, item 26 - item 50
    // page 3, item 51 - item 75

    // use useEffect to make the API call
    useEffect(() => { 
        const fetchGifs = async () => {
            // set Error state to false just in case it was not false for some reason
            setIsError(false)
            // update state for loader to true
            setIsLoading(true)
            // fetch Giphy API data
            // wrap API call in a Try/Catch statement
            try{
                const result = await axios('https://api.giphy.com/v1/gifs/trending', {
                    params: {
                        api_key: "2hKKBBfQ0kpHu1uYIDpWd0wXP1iW7vC6",
                        limit: "100",
                    }
                });

                console.log(result)
                // set the state to point to the api call endpoint. 
                setGifs(result.data.data)

            } catch(err) {
                // in case of an error, set Errr state to true and print error object to console
                setIsError(true)
                // set timeout method will set error state back to false after 4 seconds so that the error message doesn'tsit there.
                setTimeout(() => {
                    setIsError(false)
                }, 4000)
                // console.log(err)
            }
            
            // update state for loader to false
            setIsLoading(false)
        }
        // call the function
        fetchGifs()
    }, [])

    // this function renders the gifs on the page. 
    // map through each gif (from state) and return the img src for each gif
    const renderGifs = () => {
        // while gif data is fetching, display loader
        if(isLoading) {
            return <Loader />
        }
        // rendering currentItems allows to see only the gifs stored on that specific page
        return currentItems.map(el => {
            return (
                // key required? Research more
                <div key={el.id} className="gif"> 
                    <img src={el.images.fixed_height.url}/>
                </div>
            )
        })
    }
    
    // this function is called in the event that Gifs can't be fetched due to error
    const renderError = () => {
        if(isError) {
            return (
                <div 
                className="alert alert-danger alert-dismissible fade show" 
                role='alert'
                >
                    Unable to get Gifs, please try again later
                </div>
            );
        }
    };

    // search form change handler
    const handleSearchChange = (event) => {
        // set state to capture all changes to search form
        setSearch(event.target.value)
    }

    const handleSubmit = async event => {
            // use preventDefault to prevnt page reload.
            event.preventDefault();
            // same procedure as fetching data from the API earlier. 
            // set Error state to false and isLoading to true to activate spinner.
            setIsError(false);
            setIsLoading(true);
            try {
                const result = await axios('https://api.giphy.com/v1/gifs/search', {
                params: { 
                    api_key: "2hKKBBfQ0kpHu1uYIDpWd0wXP1iW7vC6",
                    // pull search value from state by passing search in params
                    q: search
                }
              });
                setGifs(result.data.data)
                setIsLoading(false)
            } catch (err) {
                setIsError(true)
                // set timeout method will set error state back to false after 4 seconds so that the error message doesn'tsit there.
                setTimeout(() => {
                    setIsError(false)
                }, 4000)
            }
            setIsLoading(false)
        };

        const pageSelected = (pageNumber) => {
            setCurrentPage(pageNumber)
        }

    return (
        <div className="m-2">
            {renderError()}
            <form className="form-inline justify-content-center m-2">
                <input 
                value={search}
                onChange={handleSearchChange}
                type ="text"
                placeholder="search gif" 
                className="form-control" 
                />
                <button 
                onClick={handleSubmit} 
                type="submit" 
                className="btn btn-primary mx-2"
                >
                    Go
                </button>
            </form>
            <Paginate 
            pageSelected={pageSelected}
            currentPage = {currentPage} 
            itemsPerPage = {itemsPerPage} 
            totalItems = {gifs.length}
            />
            <div className="container gifs">
                {renderGifs()}
            </div>
        </div>
    );
};

export default Giphy;