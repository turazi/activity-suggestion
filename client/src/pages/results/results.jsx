import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { withRouter, useLocation } from 'react-router-dom';

import { getResultsByParams } from '../../redux/actions/results';
import { resetCategories, getCategories } from '../../redux/actions/categories';

import { getCategoriesFromResults } from './../../utils/resultsOperations';

import Result from './../../components/search/result';
import Spinner from './../../components/spinner/spinner';

import MapContainer from './../../components/maps/map-container';

const Results = ({ getResultsByParams, resetCategories, getCategories, categories: { categories }, results, match }) => {
    const[params, setParams] = useState({
    })

    useEffect(() => {
        async function setParamsAndGetResults() {
            if (match.params.location) {
                params['location'] = match.params.location.split('=')[1];
            }
            if (match.params.term) {
                params['term'] = match.params.term.split('=')[1];
            }
            if (match.params.categories) {
                params['categories'] = match.params.categories.split('=')[1];
            }
            if (match.params.prices) {
                params['prices'] = match.params.prices.split('=')[1];
            }
            await getResultsByParams(params);
        }
        setParamsAndGetResults();
    }, []);

    return (
        <div className="results__container">
            <div className="results__wrapper">
                {
                    results.loading 
                        ? <Spinner />
                        : (
                            results.results.map((result, idx) => (
                                <Result key={idx} result={result} />
                            ))
                        )
                }
            </div>
            <MapContainer results={results.results} mode='multiple' />
        </div>
        
    )
}

Results.propTypes = {
    getResultsByParams: PropTypes.func.isRequired,
    resetCategories: PropTypes.func.isRequired,
    getCategories: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    results: state.results,
    categories: state.categories
})

export default connect(mapStateToProps, { getResultsByParams, resetCategories, getCategories })(withRouter(Results));