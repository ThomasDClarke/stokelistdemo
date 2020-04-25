import React, { useState, Fragment, useReducer, useMemo } from 'react'
import styled from 'styled-components'
import PostSection from '../posts/PostSection'
import { usePosts, useMountEffect } from '../hooks'
import { searchLoadReducer } from '../reducers'

const SearchBox = styled.input`
    padding: 10px 0px;
    width: 50%;
    text-align: center;
    box-sizing: border-box;
    border: solid grey 1px;
    border-radius: 5px;
`

const SearchButton = styled.button`
    border-radius: 5px;
`

const SearchBar = styled.div`
    margin: 40px auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
`

const MoreButton = styled.button`
    width: 150px;
    height: 30px;
    background-color: blue;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    display: block;
    margin: 0 auto;
`

function PostList() {
    const [searchOffset, setSearchOffset] = useState(0)
    const [searchPosts, setSearchPosts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    const [latestPosts, loadLatestPosts] = usePosts(
        `${process.env.REACT_APP_API_URL}/posts`
    )
    const [stickyPosts, loadStickyPosts] = usePosts(
        `${process.env.REACT_APP_API_URL}/posts/sticky`
    )

    useMountEffect(() => {
        loadLatestPosts()
        loadStickyPosts()
    })

    const initialState = [{ searchLoaded: false }, { searchLoading: false }]
    const [state, dispatch] = useReducer(searchLoadReducer, initialState)

    const showSearchResults = useMemo(
        () => state.searchLoading || state.searchLoaded,
        [state]
    )

    const searchURL = useMemo(
        () =>
            `${process.env.REACT_APP_API_URL}/posts/search?term=${searchTerm}`,
        [searchTerm]
    )

    const doSearch = async (event) => {
        setSearchOffset(0)
        dispatch({ type: 'loadStart' })
        if (searchTerm === '') {
            setSearchPosts([])
            dispatch({ type: 'loadReset' })
        } else {
            const searchResponse = await fetch(searchURL)
            const searchPosts = await searchResponse.json()
            setSearchPosts(searchPosts)
            dispatch({ type: 'loadSuccess' })
        }
    }

    const loadMoreSearchPosts = async () => {
        const currentOffset = searchOffset + 50
        setSearchOffset(currentOffset)
        const moreSearchResponse = await fetch(
            `${searchURL}&offset=${currentOffset}`
        )
        const moreSearchPosts = await moreSearchResponse.json()
        setSearchPosts(searchPosts.concat(moreSearchPosts))
    }

    const updateSearchTerm = (event) => {
        const newSearchTerm = event.target.value
        setSearchTerm(newSearchTerm)
        if (newSearchTerm === '') {
            dispatch({ type: 'loadReset' })
        }
    }

    const getSearchSection = () => {
        if (state.searchLoading) {
            return <div>Loading...</div>
        } else if (state.searchLoaded) {
            return (
                <PostSection
                    title="Search Results"
                    posts={searchPosts}
                    hideEmpty={false}
                >
                    {searchPosts.length % 50 === 0 && (
                        <MoreButton onClick={loadMoreSearchPosts}>
                            More Results
                        </MoreButton>
                    )}
                </PostSection>
            )
        } else {
            return null
        }
    }

    const getLatestSection = () => {
        return (
            <Fragment>
                <PostSection
                    title="Sticky Posts"
                    posts={stickyPosts}
                    hideEmpty={true}
                />
                <PostSection
                    title="Latest Posts"
                    posts={latestPosts}
                    hideEmpty={false}
                >
                    <MoreButton onClick={loadLatestPosts}>
                        More Posts
                    </MoreButton>
                </PostSection>
            </Fragment>
        )
    }

    return (
        <Fragment>
            <SearchBar>
                <SearchBox type="text" onChange={updateSearchTerm} />
                <SearchButton onClick={doSearch}>Search</SearchButton>
            </SearchBar>
            {showSearchResults ? getSearchSection() : getLatestSection()}
        </Fragment>
    )
}

export default PostList
