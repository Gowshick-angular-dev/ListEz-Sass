import React,{FC} from 'react'
import { toAbsoluteUrl } from '../../../_metronic/helpers'
import {useIntl} from 'react-intl';
import { ThemeBuilder } from '../settings/ThemeBuilder/themeBuilder';

const Support: FC = () => {
    const intl = useIntl();
    return(
        <>
        <div className='d-none'>
            <ThemeBuilder/>
        </div>
        <div className='d-flex justify-content-center'>
            <p className='pt-5 fs-1 fw-bolder'>{intl.formatMessage({id: 'have_some_questions'})}<span className='sptpg ps-2'>?  </span><span className='ps-3'> {intl.formatMessage({id: 'we_are_all'})}</span>  <span className='sptpg ps-2'>E</span>ar<span className='sptpg'>z</span>!!</p>            
        </div>
        <div className='d-flex justify-content-center'>
        <p>{intl.formatMessage({id: 'reach_out_to'})} Mahipal Rajpurohit on <a href='tel:+91 77690 79396'>+91 77690 79396</a> / <a href='mailto:mahipalraj@listez.io'>mahipalraj@listez.io</a> {intl.formatMessage({id: 'for_any_queries_or_feedbacks'})}!</p>
        </div>
        <div className='container'>
            <div className='row pt-4'>
            <div className='col-md-6'>
            <img className='w-100' src={toAbsoluteUrl('/media/avatars/wpQR.jpeg')}/>
            </div>
            <div className='col-md-6'>
            <img className='w-100' src={toAbsoluteUrl('/media/avatars/dhivya_listez.png')}/>
            </div>
            </div>
        </div>
            </>
    )
}

export {Support}