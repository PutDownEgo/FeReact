import React, { FC } from 'react'
import '../styles/Search.css'
import { ProductSearchString } from '../../../models/Product';
import { useLocation, useNavigate } from 'react-router-dom';
interface SearchResultListProps {
    results: ProductSearchString[];
    onResultClick: () => void;
}

const SearchResultList: FC<SearchResultListProps> = ({ results, onResultClick }) => {
    const navigate = useNavigate();

    const handleNavigate = (slug: string) => {
        onResultClick();
        navigate(`/detail/${slug}`);
    }

    return (
        <div className="results-list">
            {results.map((result, index) => (
                <div key={index} className="search-result" onClick={() => handleNavigate(result.slug)}>
                    <span>{result.name}</span>
                    {result.image && <img src={result.image} alt={result.name} className="result-image" />}
                </div>
            ))}
        </div>
    );
}

export default SearchResultList