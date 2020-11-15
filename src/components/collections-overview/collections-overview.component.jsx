import { connect } from "react-redux"
import CollectionPreview from "../collection-preview/collection-preview.component"
import { createStructuredSelector } from 'reselect';
import { selectCollections, selectCollectionsForPreview } from '../../redux/shop/shop.selectors';
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
    collections: selectCollectionsForPreview
})

export default connect(mapStateToProps)(CollectionsOverview);