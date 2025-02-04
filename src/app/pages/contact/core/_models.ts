import {ID, Response} from '../../../../_metronic/helpers'
export type ContactModel = {
  id: number
  email: string
  first_name: string
  last_name: string
  company_name: string
  country_code: string
  mobile?: string
  office?: string
}


export type ContactQueryResponse = Response<Array<ContactModel>>