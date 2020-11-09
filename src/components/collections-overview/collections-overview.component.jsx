import { connect } from "react-redux"
import CollectionPreview from "../collection-preview/collection-preview.component"
import { createStructuredSelector } from 'reselect';
import { selectCollections } from '../../redux/shop/shop.selectors';
import React from 'react';

const CollectionsOverview = ({collections}) => (
    <div className='collections-overview'>
            {
                collections.map(({id, ...otherCollectionsProps}) => (
                    <CollectionPreview key={id} {...otherCollectionsProps} />
                ))
            }
    </div>
)

const mapStateToProps = createStructuredSelector({
    collections: selectCollections
})

export default connect(mapStateToProps)(CollectionsOverview);