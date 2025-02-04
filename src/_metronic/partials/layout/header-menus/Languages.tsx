/* eslint-disable jsx-a11y/anchor-is-valid */
import clsx from 'clsx'
import {FC, useEffect, useState} from 'react'
import {toAbsoluteUrl} from '../../../helpers'
import {useLang, setLanguage} from '../../../i18n/Metronici18n'
import {useIntl} from 'react-intl'
import { useAuth } from '../../../../app/modules/auth'
import { getLanguagesSession } from './core/_request'
import { getLanguage, getTranslationById } from '../../../../app/pages/settings/Translations/core/requests'


const Languages: FC = () => {
  const intl = useIntl();
  const lang = useLang();
  const {currentUser, logout} = useAuth();
  const [language, setLanguage] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<any>('English');

  console.log("eugiwugrw", currentUser);
  

  const langList = async () => {
    const Response = await getLanguage()
    setLanguage(Response.output);
  }  

  useEffect(() => {
    langList();
  }, []);

  return (
    <div
      className='menu-item px-5'
      data-kt-menu-trigger='hover'
      data-kt-menu-placement='left-start'
      data-kt-menu-flip='bottom'
    >
      <a href='#' className='menu-link px-5'>
        <span className='menu-title position-relative'>
        {intl.formatMessage({id: 'language'})}
          {/* <span className='fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0'>
            {selectedLanguage}
          </span> */}
        </span>
      </a>  
      <button type='button' className='d-none' id='uyuyuyuyuyuyrtgehgrhvfdhfjdhv' onClick={() => langList()}>reload</button>
      <div className='menu-sub menu-sub-dropdown w-175px py-4'>
        {language.map((l) => {
          if(l.status == 1) {
          return(
          <div
            className='menu-item px-3'
            key={l.lang}
            onClick={async() => {
              setSelectedLanguage(l.lang_name);
              const response = await getTranslationById(l.lang)
              const obj = response.output?.reduce((acc: { [x: string]: any }, { lang_key, lang_value }: any) => {
                acc[lang_key] = lang_value;
                return acc;
              }, {});
              sessionStorage.setItem('language', JSON.stringify(obj))
              window.location.reload();
            }}
          >
            <a
              href='#'
              className='menu-link d-flex px-5'
            >
              <span className='symbol symbol-20px me-4'>
              </span>
              {l.lang_name}
            </a>
          </div>
        )}})}
      </div>
    </div>
  )
}

export {Languages}
