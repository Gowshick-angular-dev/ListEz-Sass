import clsx from 'clsx';
import React, {FC, useState} from 'react';
import { useLayout } from '../../../_metronic/layout/core'
import { useIntl } from 'react-intl';

type Props = {
}

const AdminUsersToolbar: FC<Props> = (props) => {
  const intl = useIntl();
  const {classes} = useLayout()
  
  return (
    <div className='toolbar d-flex align-items-end' id='kt_toolbar'>
      <div id='kt_toolbar_container'
        className={clsx(classes.toolbarContainer.join(' '), 'd-flex flex-stack')}>
        <div  className="menu_bar d-flex align-items-center justify-content-end w-100">
            <div className='d-flex button_bar'>
                <a className="me-4 btn btn-sm me-4" data-bs-toggle='modal' data-bs-target={'#admin_users_form'}>{intl.formatMessage({id: 'add'})}+</a>
            </div>
        </div>
      </div>
    </div>
  )
}

export {AdminUsersToolbar}