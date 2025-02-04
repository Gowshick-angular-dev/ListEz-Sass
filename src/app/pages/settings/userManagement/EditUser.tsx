import React,{FC, useEffect, useState} from 'react'
import Moment from 'moment';
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';
import {useFormik} from 'formik'
import * as Yup from 'yup'
import { Offcanvas, Toast } from 'bootstrap';
import { updateUser, getUsers, updateOtherDetails, updateProofDetails, updatePackageDetails, updateUserGoal, getUsersDropdown, updateUserPersonal, updateUserProfessional, updateUserFinancial, getUser } from './core/_requests';
import { useAuth } from '../../../modules/auth';
import { useIntl } from 'react-intl';
import Select from "react-select";
import AsyncSelect from 'react-select/async';
import makeAnimated from "react-select/animated";

const initialValues = {
    first_name: "",
    last_name: "",
    employee_id: "",
    designation: "",
    department: "",
    gender: "",
    // branch: "",
    blood_group: "",
    fathers_name: "",
    spouse_name: "",
    spouse_dob: "",
    medical_condition: "",
    p_phone_number: "",
    email: "",
    pass: "",
    password: "",
    o_phone_number: "",
    sec_mobile: "",
    o_email: "",
    emergency_contact_no: "",
    emergency_contact_person_name: "",
    relation_person: "",
    no_of_kids: "",
    kid_name_1: "",
    kid_name_2: "",
    kid_name_3: "",
    aadhar_number: "",
    pan_number: "",
    dob: "",
    marital_status: "",
    anniversary_date: "",
    date_of_joining: "",
    past_employment_history: "",
    years_of_experience: "",
    last_company: "",
    city: "",
    portfolio_head: "",
    target_for_fy_rs: "",
    target_for_fy_units: "",
    team_leader: "",
    monthly_ctc: "",
    monthly_take_home: "",
    incentive: "",
    bank_record_name: "",
    bank_name: "",
    branch_name: "",
    acc_number: "",
    ifsc_code: "",
    permenent_address: "",
    correspondence_address: "",
    created_by: "",
    profile_image: "",
    crm_login_password: "",
    crm_login_id: "",
    base_salary: "",
    pf: "",
    hra: "",
    total_ctc: "", 
    official_mobile_number: "", 
    duration: "",
    local_address: "",
    official_mail: "",
    mediclaim: "",
    conveyance: "",
    misc: "",
    annual_target: "",
    status_changed: "",
    no_of_units_committed: "",
    no_of_sales: "",
    goal_calls: "",
    goal_talktime: "",
    goal_leads_generated: "",
    goal_leads_converted: "",
    goal_site_visit: "",
    goal_meetings: "",
    goal_bookings: "",
    goal_revenue: "", 
    turnover: "",
    discount: "",
    language: "",
    incentives: "",
    state: "",
    country: "",
}

type Props = {
    currentUserId?: any,
    setUser?: any,
    setDetailClicked?: any,
    dfkjguywgf?: any,
}

const EditUser:  FC<Props> = (props) => {
    const {
        currentUserId, 
        setUser,
        setDetailClicked,
      } = props        

    const intl = useIntl();
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<{[key: string]: any}>({});    
    const {currentUser, logout} = useAuth();
    const [dropdowns, setDropdowns] = useState<any>({});
    const [isExpand, setIsExpand] = useState(true);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [changeClicked, setChangeClicked] = useState(false);
    const [tabInfo, setInfo] = useState('basicDetails');
    const [phone, SetPhone] = useState('');    
    const [imgPre, setImgPre] = useState(false);
    const [imagePreview, setImagePreview] = useState<any>(null);
    const [imageFile, setImageFile] = useState(null);
    const [state, setState] = useState<any[]>([]);
    const [city, setCity] = useState<any[]>([]);
    const [selectedDesignation, setSelectedDesignation] = useState<any>('');
    const [selectedDepartment, setSelectedDepartment] = useState<any>('');
    const [selectedPortfolioHead, setSelectedPortfolioHead] = useState<any>('');
    const [selectedTeamLeader, setSelectedTeamLeader] = useState<any>('');

    const registrationBasicSchema2 = Yup.object().shape({ 
        o_email: Yup.string()
        .email('Wrong email format')
        .min(3, 'Minimum 3 characters')
        .max(50, 'Maximum 50 characters'),
        official_mail: Yup.string()
        .email('Wrong email format')
        .min(3, 'Minimum 3 characters')
        .max(50, 'Maximum 50 characters'),
        aadhar_number: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .min(12, "Aadhar number must be 12 characters")
        .max(12, "Aadhar number must be 12 characters"),
        pan_number: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .min(10, "PAN number must be 10 characters")
        .max(10, "PAN number must be 10 characters"),
        team_leader: Yup.string(), 
        department: Yup.string(),
        p_phone_number: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .min(7, 'Minimum 7 characters')
        .max(15, 'Maximum 15 characters'),
        o_phone_number: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .min(7, 'Minimum 7 characters')
        .max(15, 'Maximum 15 characters'),
        sec_mobile: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .min(7, 'Minimum 7 characters')
        .max(15, 'Maximum 15 characters'),
        emergency_contact_no: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .min(7, 'Minimum 7 characters')
        .max(15, 'Maximum 15 characters'),
        dob: Yup.string(),
        permenent_address: Yup.string()
        .max(100, 'Maximum 100 characters'),
        correspondence_address: Yup.string()
        .max(100, 'Maximum 100 characters'),
        marital_status: Yup.string(),
        anniversary_date: Yup.string(),
        date_of_joining: Yup.string(),
        past_employment_history: Yup.string()
        .max(50, 'Maximum 50 characters'),
        gender: Yup.string(),
        blood_group: Yup.string(),
        fathers_name: Yup.string()
        .max(50, 'Maximum 50 characters'),
        spouse_name: Yup.string()
        .max(50, 'Maximum 50 characters'),
        spouse_dob: Yup.string(),
        medical_condition: Yup.string()
        .max(50, 'Maximum 50 characters'),
        emergency_contact_person_name: Yup.string()
        .max(50, 'Maximum 50 characters'),
        relation_person: Yup.string()
        .max(50, 'Maximum 50 characters'),
        no_of_kids: Yup.string()
        .max(2, 'Maximum 2 characters'),
        kid_name_1: Yup.string()
        .max(50, 'Maximum 50 characters'),
        kid_name_2: Yup.string()
        .max(50, 'Maximum 50 characters'),
        kid_name_3: Yup.string()
        .max(50, 'Maximum 50 characters'),
        years_of_experience: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .max(2, 'Maximum 2 characters'),
        last_company: Yup.string()
        .max(50, 'Maximum 50 characters'),
        city: Yup.string()
        .max(50, 'Maximum 50 characters'),
        portfolio_head: Yup.string(),
        target_for_fy_rs: Yup.string()
        .max(9, 'Maximum 9 characters'),
        target_for_fy_units: Yup.string()
        .max(9, 'Maximum 9 characters'),
        monthly_ctc: Yup.string()
        .max(9, 'Maximum 9 characters'),
        monthly_take_home: Yup.string()
        .max(9, 'Maximum 9 characters'),
        official_mobile_number: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .min(7, 'Minimum 7 characters')
        .max(15, 'Maximum 15 characters'),
        incentive: Yup.string()
        .max(9, 'Maximum 9 characters'),
        bank_record_name: Yup.string()
        .max(50, 'Maximum 50 characters'),
        bank_name: Yup.string()
        .max(50, 'Maximum 50 characters'),
        acc_number: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .max(25, 'Maximum 25 characters'),
        ifsc_code: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .max(15, 'Maximum 15 characters'),
        branch_name: Yup.string()
        .max(50, 'Maximum 50 characters'),
        crm_login_id: Yup.string()
        .max(50, 'Maximum 50 characters'),
        crm_login_password: Yup.string()
        .max(50, 'Maximum 50 characters'),
        base_salary: Yup.string()
        .max(9, 'Maximum 9 characters'),
        pf: Yup.string()
        .max(9, 'Maximum 9 characters'),
        hra: Yup.string()
        .max(9, 'Maximum 9 characters'),
        duration: Yup.string()
        .max(9, 'Maximum 9 characters'),
        local_address: Yup.string()
        .max(48, 'Maximum 48 characters'),
        mediclaim: Yup.string()
        .max(9, 'Maximum 9 characters'),
        conveyance: Yup.string()
        .max(9, 'Maximum 9 characters'),
        misc: Yup.string()
        .max(9, 'Maximum 9 characters'),
        total_ctc: Yup.string()
        .max(9, 'Maximum 9 characters'),
        annual_target: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .max(9, 'Maximum 9 characters'),
        status_changed: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .max(9, 'Maximum 9 characters'),
        no_of_units_committed: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .max(9, 'Maximum 9 characters'),
        no_of_sales: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .max(9, 'Maximum 9 characters'),
        goal_calls: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .max(9, 'Maximum 9 characters'),
        goal_talktime: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .max(9, 'Maximum 9 characters'),
        goal_leads_generated: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .max(9, 'Maximum 9 characters'),
        goal_leads_converted: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .max(9, 'Maximum 9 characters'),
        goal_site_visit: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .max(9, 'Maximum 9 characters'),
        goal_meetings: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .max(9, 'Maximum 9 characters'),
        goal_bookings: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .max(9, 'Maximum 9 characters'),
        goal_revenue: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .max(9, 'Maximum 9 characters'),
        incentives: Yup.string()
        .max(9, 'Maximum 9 characters'),
        discount: Yup.string()
        .max(9, 'Maximum 9 characters'),
        turnover: Yup.string()
        .max(9, 'Maximum 9 characters'), 
    })
    const registrationBasicSchema = Yup.object().shape({            
        first_name: Yup.string()
        .min(3, 'Minimum 3 characters')
        .max(50, 'Maximum 50 characters')
        .required('Name is required'),
        last_name: Yup.string()            
        .max(50, 'Maximum 50 characters'),          
        email: Yup.string()
        .email('Wrong email format')
        .min(3, 'Minimum 3 characters')
        .max(50, 'Maximum 50 characters')
        .required('Email is required'),
        o_email: Yup.string()
        .email('Wrong email format')
        .min(3, 'Minimum 3 characters')
        .max(50, 'Maximum 50 characters'),
        designation: Yup.string()
        .required('Designation is required'),
        aadhar_number: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .min(12, "Aadhar number must be 12 characters")
        .max(12, "Aadhar number must be 12 characters"),
        pan_number: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .min(10, "PAN number must be 10 characters")
        .max(10, "PAN number must be 10 characters"),
        team_leader: selectedDesignation != 1 ? Yup.string().required('Designation is required') : Yup.string(), 
        department: Yup.string(),
        p_phone_number: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .min(7, 'Minimum 7 characters')
        .max(15, 'Maximum 15 characters'),
        o_phone_number: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .min(7, 'Minimum 7 characters')
        .max(15, 'Maximum 15 characters'),
        sec_mobile: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
        .min(7, 'Minimum 7 characters')
        .max(15, 'Maximum 15 characters'),
        dob: Yup.string(),
        permenent_address: Yup.string()
        .max(100, 'Maximum 100 characters'),
        correspondence_address: Yup.string()
        .max(100, 'Maximum 100 characters'),       
    })

    const dropdownsList = async (id:any) => {
        const response = await getUsersDropdown(id)
        setDropdowns(response.output)
        setState(response.output?.state)       
        setCity(response.output?.city) 
    }

    const FetchContactDetails =  async (id:any) => {
        setIsLoading(true)
        const response = await getUser(id)
        setUserInfo(response.output[0]);
        let userData = response.output[0];
        SetPhone(userData.p_phone_number)

        setSelectedDesignation(userData.designation);
        dropdownsList(userData.designation);
        setSelectedDepartment(userData.department);
        setSelectedPortfolioHead(userData.portfolio_head);
        setSelectedTeamLeader(userData.team_leader);
        
        formik.setFieldValue('first_name', userData.first_name ?? '')
        formik.setFieldValue('last_name', userData.last_name ?? '')
        formik.setFieldValue('employee_id', userData.employee_id ?? '')
        formik.setFieldValue('designation', userData.designation ?? '')
        formik.setFieldValue('p_phone_number', userData.p_phone_number ?? '')
        formik.setFieldValue('o_phone_number', userData.o_phone_number ?? '')
        formik.setFieldValue('o_email', userData.o_email ?? '')
        formik.setFieldValue('email', userData.email ?? '')
        formik.setFieldValue('aadhar_number', userData.aadhar_number ?? '')
        formik.setFieldValue('pan_number', userData.pan_number ?? '')
        formik.setFieldValue('dob', Moment(userData.dob).format('YYYY-MM-DD') ?? '')
        formik.setFieldValue('date_of_joining', Moment(userData.date_of_joining).format('YYYY-MM-DD') ?? '')
        formik.setFieldValue('team_leader', userData.team_leader ?? '')
        formik.setFieldValue('total_ctc', userData.total_ctc ?? '')

        formik2.setFieldValue('gender', userData.gender ?? '')
        formik2.setFieldValue('blood_group', userData.blood_group ?? '')
        formik2.setFieldValue('father_name', userData.father_name ?? '')
        formik2.setFieldValue('spouse_name', userData.spouse_name ?? '')
        formik2.setFieldValue('spouse_dob', Moment(userData.spouse_dob).format('YYYY-MM-DD') ?? '')
        formik2.setFieldValue('medical_condition', userData.medical_condition ?? '')
        formik2.setFieldValue('emergency_contact_person_name', userData.emergency_contact_person_name ?? '')
        formik2.setFieldValue('relation_person', userData.relation_person ?? '')
        formik2.setFieldValue('fathers_name', userData.fathers_name ?? '')
        formik2.setFieldValue('no_of_kids', userData.no_of_kids ?? '')
        formik2.setFieldValue('kid_name_1', userData.kid_name_1 ?? '')
        formik2.setFieldValue('kid_name_2', userData.kid_name_2 ?? '')
        formik2.setFieldValue('kid_name_3', userData.kid_name_3 ?? '')
        formik2.setFieldValue('crm_login_id', userData.email ?? '')
        formik2.setFieldValue('crm_login_password', userData.crm_login_password ?? '')
        formik2.setFieldValue('correspondence_address', userData.correspondence_address ?? '')
        formik2.setFieldValue('permenent_address', userData.permenent_address ?? '')
        formik2.setFieldValue('sec_mobile', userData.sec_mobile ?? '')
        formik2.setFieldValue('marital_status', userData.marital_status ?? '')
        formik2.setFieldValue('anniversary_date', Moment(userData.anniversary_date).format('YYYY-MM-DD') ?? '')
        formik2.setFieldValue('emergency_contact_no', userData.emergency_contact_no ?? '')

        formik3.setFieldValue('past_employment_history', userData.past_employment_history ?? '')
        formik3.setFieldValue('years_of_experiance', userData.years_of_experiance ?? '')
        formik3.setFieldValue('last_company', userData.last_company ?? '')
        formik3.setFieldValue('city', userData.city ?? '')
        formik3.setFieldValue('target_for_fy_rs', userData.target_for_fy_rs ?? '')
        formik3.setFieldValue('target_for_fy_units', userData.target_for_fy_units ?? '')
        formik3.setFieldValue('monthly_ctc', userData.monthly_ctc ?? '')
        formik3.setFieldValue('monthly_takehome', userData.monthly_takehome ?? '')
        formik3.setFieldValue('incentive', userData.incentive ?? '')
        formik3.setFieldValue('duration', userData.duration ?? '')
        formik3.setFieldValue('official_mail', userData.official_mail ?? '')
        formik3.setFieldValue('official_mobile_number', userData.official_mobile_number ?? '')
        formik3.setFieldValue('local_address', userData.local_address ?? '')
        formik3.setFieldValue('monthly_take_home', userData.monthly_take_home ?? '')
        formik3.setFieldValue('years_of_experience', userData.years_of_experience ?? '')
        
        formik4.setFieldValue('bank_record_name', userData.bank_record_name ?? '')
        formik4.setFieldValue('bank_name', userData.bank_name ?? '')
        formik4.setFieldValue('branch_name', userData.branch_name ?? '')
        formik4.setFieldValue('acc_number', userData.acc_number ?? '')
        formik4.setFieldValue('ifsc_code', userData.ifsc_code ?? '')
        formik4.setFieldValue('base_salary', userData.base_salary ?? '')
        formik4.setFieldValue('pf', userData.pf ?? '')
        formik4.setFieldValue('hra', userData.hra ?? '')
        formik4.setFieldValue('mediclaim', userData.mediclaim ?? '')
        formik4.setFieldValue('conveyance', userData.conveyance ?? '')
        formik4.setFieldValue('misc', userData.misc ?? '')
        formik4.setFieldValue('incentive', userData.incentive ?? '')
        formik4.setFieldValue('total_ctc', userData.total_ctc ?? '')

        formik5.setFieldValue('annual_target', userData.annual_target ?? '')
        formik5.setFieldValue('status_changed', userData.status_changed ?? '')
        formik5.setFieldValue('no_of_units_committed', userData.no_of_units_committed ?? '')
        formik5.setFieldValue('no_of_sales', userData.no_of_sales ?? '')
        formik5.setFieldValue('goal_calls', userData.goal_calls ?? '')
        formik5.setFieldValue('goal_talktime', userData.goal_talktime ?? '')
        formik5.setFieldValue('goal_leads_generated', userData.goal_leads_generated ?? '')
        formik5.setFieldValue('goal_leads_converted', userData.goal_leads_converted ?? '')
        formik5.setFieldValue('goal_site_visit', userData.goal_site_visit ?? '')
        formik5.setFieldValue('goal_meetings', userData.goal_meetings ?? '')
        formik5.setFieldValue('goal_bookings', userData.goal_bookings ?? '')
        formik5.setFieldValue('goal_revenue', userData.goal_revenue ?? '')
        formik5.setFieldValue('turnover', userData.turnover ?? '')
        formik5.setFieldValue('incentives', userData.incentives ?? '')
        formik5.setFieldValue('discount', userData.discount ?? '')
        setIsLoading(false);
    }

    const closeDialogue = () => {
        setDetailClicked({});
        var offCanvasEl = document.getElementById('kt_expand'+userInfo.id);
        offCanvasEl?.classList.add('invisible');
        const bsOffcanvas = new Offcanvas(offCanvasEl!);
        bsOffcanvas.hide();
    }

    useEffect(() => {
        if(currentUserId?.id) {
            FetchContactDetails(currentUserId?.id);
        }
    }, [currentUserId?.id]);

      const formik = useFormik({
        initialValues,
        validationSchema: registrationBasicSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
            setIsLoading(true)
          try {
            var formData = new FormData(); 
            formData.append('first_name', values.first_name);
            formData.append('last_name', values.last_name);
            formData.append('employee_id', values.employee_id);
            formData.append('designation', selectedDesignation);
            formData.append('department', selectedDepartment);
            formData.append('p_phone_number', values.p_phone_number);
            formData.append('email', values.email);
            formData.append('o_phone_number', values.o_phone_number);
            formData.append('o_email', values.o_email);
            formData.append('aadhar_number', values.aadhar_number);
            formData.append('pan_number', values.pan_number);
            formData.append('dob', values.dob == "Invalid date" ? '' : values.dob);
            formData.append('date_of_joining', values.date_of_joining == "Invalid date" ? '' : values.date_of_joining);
            formData.append('team_leader', selectedTeamLeader);
            formData.append('portfolio_head', selectedPortfolioHead);
            imageFile && formData.append('profile_image', imageFile!);

            const updateUserData = await updateUser(currentUserId?.id, formData)
    
            if(updateUserData.status == 200){
                setIsLoading(false);
                setInfo("basicDetails");
                document.getElementById('fgbirgiebjrtjegtrtbkdffh')?.click();
                document.getElementById('erhwrgiwuriwurtwyergjwerbw87r345345345345')?.click();
                document.getElementById('jrht7tryiubou6fgdfbsdfuegwheoweug')?.click();
                FetchContactDetails(currentUserId?.id);
                var toastEl = document.getElementById('myToastUpdate');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                // const characterResponse = await getUsers()
                // setUser(characterResponse.output)
            } else if(updateUserData.status == 400) {
                setIsLoading(false)
                var toastEl = document.getElementById('userEmailExist');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }    
          } catch (error) {
            console.error(error)
            var toastEl = document.getElementById('myToastError');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setIsLoading(false)
          }
        },
      })

      const formik2 = useFormik({
        initialValues,
        validationSchema: registrationBasicSchema2,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
            setIsLoading(true)
          try {
            
            const body = {
                "crm_login_id": values.crm_login_id,
                "crm_login_password": values.crm_login_password,
                "gender": values.gender,
                "blood_group": values.blood_group,
                "sec_mobile" : values.sec_mobile,
                "permenent_address": values.permenent_address,
                "correspondence_address": values.correspondence_address,
                "fathers_name": values.fathers_name,
                "marital_status" : values.marital_status,
                "anniversary_date" : values.anniversary_date == "Invalid date" ? '' : values.anniversary_date,
                "spouse_name": values.spouse_name,
                "spouse_dob": values.spouse_dob == "Invalid date" ? '' : values.spouse_dob,
                "emergency_contact_no" : values.emergency_contact_no,
                "medical_condition": values.medical_condition,
                "emergency_contact_person_name": values.emergency_contact_person_name,
                "relation_person": values.relation_person,
                "no_of_kids": values.no_of_kids,
                "kid_name_1": values.kid_name_1,
                "kid_name_2": values.kid_name_2,
                "kid_name_3": values.kid_name_3
            }
    
            const updateUserData = await updateUserPersonal(currentUserId?.id, body)
    
            if(updateUserData!= null){
                setIsLoading(false);
                setInfo("personalDetails");
                // document.getElementById('kt_expand_close')?.click();
                var toastEl = document.getElementById('myToastUpdate');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                // setUser(updateUserData.output)
            } 
    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setIsLoading(false)
          }
        },
      })

      const formik3 = useFormik({
        initialValues,
        validationSchema: registrationBasicSchema2,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
            setIsLoading(true)
          try {
            
            const body = {
                "years_of_experience": values.years_of_experience,
                "last_company": values.last_company,
                "duration": values.duration,
                "official_mobile_number": values.official_mobile_number,
                "official_mail": values.official_mail,
                "local_address": values.local_address,
                "country": values.country,
                "target_for_fy_rs": values.target_for_fy_rs,
                "target_for_fy_units": values.target_for_fy_units,
                "monthly_ctc": values.monthly_ctc,
                "incentive": values.incentive,
                "monthly_take_home": values.monthly_take_home,
            }   
    
            const updateUserData = await updateUserProfessional(currentUserId?.id, body)
    
            if(updateUserData!= null){
                setIsLoading(false);
                setInfo("professionalDetails");
                // document.getElementById('kt_expand_close')?.click();
                var toastEl = document.getElementById('myToastUpdate');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                // const characterResponse = await getUsers()
                // setUser(updateUserData.output)
            } 
    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setIsLoading(false)
          }
        },
      })

      const formik4 = useFormik({
        initialValues,
        validationSchema: registrationBasicSchema2,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
            setIsLoading(true)
          try {            
            const body = {
                "base_salary": values.base_salary,
                "pf": values.pf,
                "hra": values.hra,
                "mediclaim": values.mediclaim,
                "conveyance": values.conveyance,
                "misc": values.misc,
                "bank_record_name": values.bank_record_name,
                "bank_name": values.bank_name,
                "acc_number": values.acc_number,
                "ifsc_code": values.ifsc_code,
                "branch_name": values.branch_name,
                "total_ctc": values.total_ctc,
            }    
            const updateUserData = await updateUserFinancial(currentUserId?.id, body)
    
            if(updateUserData!= null){
                setIsLoading(false);
                setInfo("financialDetails");
                // document.getElementById('kt_expand_close')?.click();
                var toastEl = document.getElementById('myToastUpdate');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                // const characterResponse = await getUsers()
                // setUser(updateUserData.output)
            }     
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setIsLoading(false)
          }},
      })

      const formik5 = useFormik({
        initialValues,
        validationSchema: registrationBasicSchema2,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setIsLoading(true)
          try {
            var userId = currentUser?.id;
            
            const body = {
                "annual_target": values.annual_target,
                "status_changed": values.status_changed,
                "no_of_units_committed": values.no_of_units_committed,
                "no_of_sales": values.no_of_sales,
                "goal_calls": values.goal_calls,
                "goal_talktime": values.goal_talktime,
                "goal_leads_generated": values.goal_leads_generated,
                "goal_leads_converted": values.goal_leads_converted,
                "goal_site_visit": values.goal_site_visit,
                "goal_meetings": values.goal_meetings,
                "goal_bookings": values.goal_bookings,
                "goal_revenue": values.goal_revenue,
                "turnover": values.turnover,
                "discount": values.discount,
                "incentives": values.incentives,
            }
    
            const updateUserData = await updateUserGoal(currentUserId?.id, body)

            if(updateUserData!= null){
                setIsLoading(false);
                setInfo("goalDetails");
                // document.getElementById('kt_expand_close')?.click();
                var toastEl = document.getElementById('myToastUpdate');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                // const characterResponse = await getUsers()
                // setUser(updateUserData.output)
            } 
    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setIsLoading(false)
          }
        },
      })

      const minimaximize = () => {
        setIsExpand(current => !current);
    }
    
    const fullScreenChange = () => {
        setIsFullScreen(current => !current);
    }  

    const changeImage = async (id:any, image:any) => {
        let image_as_files:any = image.target.files[0];
        var formData = new FormData(); 
        formData.append('profile_image', image_as_files);
        
        const saveUserData = await updateUser(currentUserId?.id, formData)
        if(saveUserData != null){                
            setChangeClicked(false);
            FetchContactDetails(currentUserId?.id)
            const characterResponse = await getUsers()
            setUser(characterResponse.output)                                     
        }
    }
    const removeImage = async (id:any) => {
        var formData = new FormData(); 
        formData.append('profile_image', '');
        
        const saveUserData = await updateUser(currentUserId?.id, formData)
        if(saveUserData != null){                
            setChangeClicked(false);
            FetchContactDetails(currentUserId?.id)
            const characterResponse = await getUsers()
            setUser(characterResponse.output)                                     
        }
    }

    const isValidFileUploaded=(file:any)=>{
        const validExtensions = ['png','jpeg','jpg']
        const fileExtension = file.type.split('/')[1]
        return validExtensions.includes(fileExtension)
      }

    const handleImagePreview = (e:any) => {
        if(e.target.files[0].size > 2097152){
            var toastEl = document.getElementById('usrimgSizeErr');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
            (document.getElementById('userProfileImgUdt') as HTMLInputElement).value = '';
            return;
          } else {
            const file = e.target.files[0];
            if(isValidFileUploaded(file)){
                let image_as_base64:any = URL.createObjectURL(e.target.files[0]);
                let image_as_files:any = e.target.files[0];
            
                setImageFile(image_as_files);
                setImagePreview(image_as_base64);
                setImgPre(true);        
            } else { 
                (document.getElementById('userProfileImgUdt') as HTMLInputElement).value = '';
                var toastEl = document.getElementById('usrimgFileErr');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            } 
          }
    }

    console.log("werugwueirgwuierhwerojwe", formik.errors)

    const imgRemove = () => {
        setImageFile(null);
        setImagePreview('');
        setImgPre(false);
    }
      
    return(
        
        <div className={isExpand ? isFullScreen ? "w-100 contact_details_page full_screen" : "w-75 contact_details_page full_screen m-5" : "contact_details_page small_screen d-flex align-items-end justify-content-end m-5"}>
            { isLoading ? 
            <div className="card main_bg h-100">
                <div className='w-100 h-100'>
                    <div className='d-flex justify-content-center flex-column align-items-center vh-100'>
                        <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="w-250px h-50px mb-9" alt='' />
                        <div className="spinner-border taskloader" style={{width:"3rem", height: "3rem"}} role="status">
                            <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                        </div>
                    </div> 
                </div> 
            </div> :
             isExpand ?
            <div className="card main_bg h-100">
                    <div className='card-toolbar d-flex align-items-center justify-content-end'>
                        <button className="btn m-3 expand_btn" onClick={fullScreenChange}>
                            <img src={isFullScreen ? toAbsoluteUrl('/media/custom/overview-icons/comp_white.svg') : toAbsoluteUrl('/media/custom/overview-icons/expand_white.svg')} className="svg_icon" alt='' />
                        </button>
                        <button className="btn m-3 minimize_btn" onClick={() => {
                            minimaximize();
                            var element = document.getElementById("fjgvbrkugfrugrgowiue"+currentUserId?.id);
                            var headerOffset = 350;
                            var elementPosition:any = element?.getBoundingClientRect().top;
                            var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                            
                            window.scrollTo({
                                top: offsetPosition,
                            });
                        }}>
                            <img src={toAbsoluteUrl('/media/custom/overview-icons/minimize_white.svg')} className="svg_icon" alt='' />
                        </button>
                        <button
                            type='button'
                            className='btn m-3 close_btn'
                            id='kt_usersettings_edit_close'
                            data-bs-dismiss="offcanvas"
                            onClick={() => {
                                var element = document.getElementById("fjgvbrkugfrugrgowiue"+currentUserId?.id);
                                var headerOffset = 350;
                                var elementPosition:any = element?.getBoundingClientRect().top;
                                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                                
                                window.scrollTo({
                                    top: offsetPosition,
                                    // behavior: "smooth"
                                });
                                closeDialogue();                               
                            }}
                            >
                                <img src={toAbsoluteUrl('/media/custom/overview-icons/cancel_white.svg')} className="svg_icon" alt='' />
                        </button>
                    </div>
                <div className="row px-9">
                    <div className="col-12 col-md-4 mb-3">
                        <div className="card bs_1 name_card h-100 mx-2">
                            <div className="card-body p-3">
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0 position-relative">
                                        {changeClicked == false ? 
                                            <img onError={e => { e.currentTarget.src = toAbsoluteUrl('/media/avatars/blank.png') }} src={userInfo.profile_image ? process.env.REACT_APP_API_BASE_URL+'uploads/users/profile_image/'+userInfo.id+'/'+userInfo.profile_image : ''} className="user_img" alt='' /> : 
                                            <><span className="user_img btn btn-file">
                                                <i className="fa fa-upload my-2" aria-hidden="true"></i>{intl.formatMessage({id: 'upload'})} <input type="file" {...formik.getFieldProps('profile_image')} onChange={(e) => changeImage(userInfo.id, e)} />
                                            </span><div className='text-center position-absolute top-0 end-0'><button type='button' className='btn btn-sm btn-icon btn-secondary rounded-circle' title='Remove image' onClick={(e) => removeImage(userInfo.id)}><img src={toAbsoluteUrl('/media/custom/overview-icons/cancel_white.svg')} className="svg_icon" alt='' /></button></div></>}
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <div className="">
                                            <div className="d-flex align-items-center overflow-hidden">
                                                <div className="d-flex align-items-center">                                                    
                                                    <h4 className="mb-0 ms-2">{userInfo.first_name+' '}{userInfo.last_name ? userInfo.last_name : ''}</h4>
                                                </div>                                                
                                            </div>
                                            <div className="d-flex">
                                                <a href={"mailto:"+ userInfo.email} className="btn_soft_primary"><i className="fas fa-envelope"></i></a>
                                                <a href={"tel:"+ userInfo.p_phone_number} className="btn_soft_primary"><i className="fas fa-phone-alt"></i></a>
                                                {/* <a href="/#" className="btn_soft_primary"><i className="fas fa-clipboard-list"></i></a> */}
                                                <a href={"https://api.whatsapp.com/send?phone="+ userInfo.p_phone_number} className="btn_soft_primary">
                                                    <img src={toAbsoluteUrl('/media/custom/whatsapp.svg')} className="svg_icon" alt='' />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-8 mb-3">
                        <div className="card bs_1 h-100 mx-2 info_card">
                            <div className="row py-3 px-6">
                                <div className="col-md-3 col-12 col-sm-6 p-2 px-4">
                                    <small className="mb-0">{intl.formatMessage({id: 'email'})}</small>
                                    <p className="mb-0">{userInfo.email}</p>
                                </div>
                                <div className="col-md-3 col-12 col-sm-6 p-2 px-4">
                                    <small className="mb-0">{intl.formatMessage({id: 'phone_number'})}</small>
                                    <p className="mb-0">{phone}</p>
                                </div>
                                <div className="col-md-3 col-12 col-sm-6 p-2 px-4">
                                    <small className="mb-0">{intl.formatMessage({id: 'created_by_name'})}</small>
                                    <p className="mb-0">{userInfo.created_by_name}</p>
                                </div>
                                <div className="col-md-3 col-12 col-sm-6 p-2 px-4">
                                    <small className="mb-0">{intl.formatMessage({id: 'created_date'})}</small>
                                    <p className="mb-0">{Moment(userInfo.created_at).format('DD-MMMM-YYYY')}</p>
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>
                <div className="card-body pt-0">
                    <div className="tab_container bg_white br_10 bs_1 mx-2">
                        <div className="row mt-4">
                            <div className="col-12">
                                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                    <li className="nav-item" role="presentation" onClick={() => setInfo("basicDetails")}>
                                        <button className={tabInfo == 'basicDetails' ? "nav-link active" : "nav-link"} id="basicDetails-tab" data-bs-toggle="pill" data-bs-target={"#basicDetails"+currentUserId?.id} type="button" role="tab" aria-controls={"basicDetails"+currentUserId?.id} aria-selected="true">{intl.formatMessage({id: 'basic_details'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation" onClick={() => setInfo("personalDetails")}>
                                        <button className={tabInfo == 'personalDetails' ? "nav-link active" : "nav-link"} id="personalDetails-tab" data-bs-toggle="pill" data-bs-target={"#personalDetails"+currentUserId?.id} type="button" role="tab" aria-controls={"personalDetails"+currentUserId?.id} aria-selected="false">{intl.formatMessage({id: 'personal_details'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation" onClick={() => setInfo("professionalDetails")}>
                                        <button className={tabInfo == 'professionalDetails' ? "nav-link active" : "nav-link"} id="professionalDetails-tab" data-bs-toggle="pill" data-bs-target={"#professionalDetails"+currentUserId?.id} type="button" role="tab" aria-controls={"professionalDetails"+currentUserId?.id} aria-selected="false">{intl.formatMessage({id: 'professional_details'})}</button>
                                    </li>
                                    <li className="nav-item" role="presentation" onClick={() => setInfo("financialDetails")}>
                                        <button className={tabInfo == 'financialDetails' ? "nav-link active" : "nav-link"} id="financialDetails-tab" data-bs-toggle="pill" data-bs-target={"#financialDetails"+currentUserId?.id} type="button" role="tab" aria-controls={"financialDetails"+currentUserId?.id} aria-selected="false">{intl.formatMessage({id: 'financial_details'})}</button>
                                    </li>                                    
                                    <li className="nav-item" role="presentation" onClick={() => setInfo("goalDetails")}>
                                        <button className={tabInfo == 'goalDetails' ? "nav-link active" : "nav-link"} id="golDetails-tab" data-bs-toggle="pill" data-bs-target={"#goalDetails"+currentUserId?.id} type="button" role="tab" aria-controls={"goalDetails"+currentUserId?.id} aria-selected="false">{intl.formatMessage({id: 'goals_details'})}</button>
                                    </li>                                    
                                </ul>
                                <div className="tab-content pt-5" id="pills-tabContent">
                                    <div className={tabInfo == 'basicDetails' ? "tab-pane fade show active" : "tab-pane fade"} id={"basicDetails"+currentUserId?.id} role="tabpanel" aria-labelledby="basicDetails-tab">
                                    <div className='mb-9' style={{ height: '100%', width: '100%',}}>
                                        <form noValidate onSubmit={formik.handleSubmit}>
                                            <div className='row'>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'first_name'})}</label>
                                            <div className="input-group first mb-3 input_prepend">
                                                <select className="px-2 py-2 btn_secondary btn btn-sm prepend">
                                                    <option value="Mr">Mr</option>
                                                    <option value="Mrs">Mrs</option>
                                                </select>
                                                <input type="text" {...formik.getFieldProps('first_name')}
                                                    className="form-control" placeholder="First Name" />
                                            </div>
                                            {formik.touched.first_name && formik.errors.first_name && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.first_name}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'last_name'})}</label>
                                            <div className="input-group">
                                                <input type="text" {...formik.getFieldProps('last_name')}
                                                    className="form-control" placeholder="Last Name" />
                                            </div>
                                            {formik.touched.last_name && formik.errors.last_name && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.last_name}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'employee_id'})}</label>
                                            <div className="input-group">
                                                <input type="text" {...formik.getFieldProps('employee_id')} className="form-control" placeholder="Enter Id" />
                                            </div>
                                            {formik.touched.employee_id && formik.errors.employee_id && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.employee_id}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'phone_number'})}</label>
                                            <div className="input-group mb-3 input_prepend">
                                                <select className="px-2 py-2 btn_secondary btn btn-sm prepend">
                                                    <option value="">+91</option>
                                                </select>
                                                <input type="text" min="0" {...formik.getFieldProps('p_phone_number')} onChange={(e) => formik.setFieldValue("p_phone_number", e.target?.value.replace(/[^0-9]/g, ""))} className="form-control" placeholder="Enter your Phone Number" maxLength={15} />
                                            </div>
                                            {formik.touched.p_phone_number && formik.errors.p_phone_number && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.p_phone_number}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'email_id'})}</label>
                                            <div className="input-group mb-3">
                                                <input type="email" {...formik.getFieldProps('email')} className="form-control" placeholder="Enter your email" />
                                            </div>
                                            {formik.touched.email && formik.errors.email && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.email}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {/* <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'official_phone_number'})}</label>
                                            <div className="input-group mb-3 input_prepend">
                                                <select className="px-2 py-2 btn_secondary btn btn-sm prepend">
                                                    <option value="">+91</option>
                                                </select>
                                                <input type="text" min="0" {...formik.getFieldProps('o_phone_number')} onChange={(e) => formik.setFieldValue("o_phone_number", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15} className="form-control" placeholder="Enter Phone Number" />
                                            </div>
                                            {formik.touched.o_phone_number && formik.errors.o_phone_number && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.o_phone_number}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div> */}
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'designation'})}</label>
                                            <div className="input-group mb-3">
                                                {/* <select
                                                    {...formik.getFieldProps('designation')} id='designationId' onChange={(e) => desiChange(e.target.value)}
                                                    className="form-select btn btn-sm w-100 text-start">
                                                    <option disabled value=''>Select</option>
                                                    {dropdowns.roles?.map((designValue:any,i:any)=> {
                                                    return (
                                                    <option value={designValue.id} key={i}>{designValue.role_name}</option>
                                                    )
                                                    })} 
                                                </select> */}
                                                <Select
                                                    options={dropdowns.roles}
                                                    components={makeAnimated()}
                                                    getOptionLabel={(option:any) => option.role_name}
                                                    getOptionValue={(option:any) => option.id}
                                                    // defaultValue={dropdowns.roles?.find((item:any) => selectedDesignation == item.id)}
                                                    value={dropdowns.roles?.find((item:any) => selectedDesignation == item.id)}
                                                    classNamePrefix="border-0 search_select_color "
                                                    className={"w-100 text-start"}
                                                    // {...formik.getFieldProps('designation')}
                                                    onChange={(val:any) => {
                                                        if(val.id != 1) {
                                                            dropdownsList(val.id);
                                                        } else {
                                                            formik.setFieldValue('team_leader', '');
                                                            setSelectedTeamLeader('');
                                                            setSelectedPortfolioHead('');
                                                        }
                                                        formik.setFieldValue('designation', val.id);
                                                        setSelectedDesignation(val.id);
                                                    }}
                                                    placeholder={"designation"}
                                                    />
                                            </div>
                                            {formik.touched.designation && formik.errors.designation && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik.errors.designation}</span>
                                                </div>
                                            </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'department'})}</label>
                                            <div className="input-group mb-3">
                                                {/* <select 
                                                    {...formik.getFieldProps('department')} 
                                                    className="form-select btn btn-sm w-100 text-start">
                                                    <option disabled value=''>Select</option>
                                                    {dropdowns.department?.map((deptValue:any,i:any)=> {
                                                    return (
                                                    <option value={deptValue.id} key={i}>{deptValue.option_value}</option>
                                                    )
                                                    })} 
                                                </select> */}
                                                <Select
                                                    options={dropdowns.department}
                                                    components={makeAnimated()}
                                                    getOptionLabel={(option:any) => option.option_value}
                                                    getOptionValue={(option:any) => option.id}
                                                    // defaultValue={dropdowns.roles?.find((item:any) => selectedDesignation == item.id)}
                                                    value={dropdowns.department?.find((item:any) => selectedDepartment == item.id)}
                                                    classNamePrefix="border-0 search_select_color "
                                                    className={"w-100 text-start"}
                                                    // {...formik.getFieldProps('designation')}
                                                    onChange={(val:any) => {
                                                        setSelectedDepartment(val.id)
                                                    }}
                                                    placeholder={"department"}
                                                    />
                                            </div>
                                            {formik.touched.department && formik.errors.department && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.department}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>  
                                        {selectedDesignation != 1 && <>                                      
                                        <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'team_leader'})}</label>
                                        <div className="input-group mb-3">
                                            {/* <select className="form-select btn btn-sm w-100 text-start" {...formik.getFieldProps('team_leader')}>
                                                <option disabled value="">Select</option>
                                                {dropdowns.teamleader?.map((team:any,i:any)=> {
                                                    return (
                                                    <option value={team.user_id} key={i}>{team.first_name + " " + team.last_name}</option>
                                                    )
                                                    })}
                                            </select> */}
                                            <Select
                                                options={dropdowns.team_leader}
                                                components={makeAnimated()}
                                                getOptionLabel={(option:any) => option.users_name}
                                                getOptionValue={(option:any) => option.id}
                                                // defaultValue={dropdowns.roles?.find((item:any) => selectedDesignation == item.id)}
                                                value={dropdowns.team_leader?.find((item:any) => selectedTeamLeader == item.id)}
                                                classNamePrefix="border-0 search_select_color "
                                                className={"w-100 text-start"}
                                                // {...formik.getFieldProps('designation')}
                                                onChange={(val:any) => {
                                                    formik.setFieldValue('team_leader', val.id);
                                                    setSelectedTeamLeader(val.id);
                                                }}
                                                placeholder={"Team leader"}
                                                />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'portfolio_head'})}</label>
                                        <div className="input-group mb-3">
                                            {/* <select className="form-select btn btn-sm w-100 text-start" {...formik.getFieldProps('portfolio_head')}>
                                                <option disabled value="">Select</option>
                                                {dropdowns.portfoliohead?.map((team:any,i:any)=> {
                                                    return (
                                                    <option value={team.user_id} key={i}>{team.first_name + " " + team.last_name}</option>
                                                    )
                                                    })}
                                            </select> */}
                                            <Select
                                                options={dropdowns.team_leader}
                                                components={makeAnimated()}
                                                getOptionLabel={(option:any) => option.users_name}
                                                getOptionValue={(option:any) => option.id}
                                                // defaultValue={dropdowns.roles?.find((item:any) => selectedDesignation == item.id)}
                                                value={dropdowns.team_leader?.find((item:any) => selectedPortfolioHead == item.id)}
                                                classNamePrefix="border-0 search_select_color border_no "
                                                className={"w-100 text-start"}
                                                // {...formik.getFieldProps('designation')}
                                                onChange={(val:any) => {
                                                    setSelectedPortfolioHead(val.id);
                                                }}
                                                placeholder={"Portfolio head"}
                                                />
                                        </div>
                                    </div></>}                                                                            
                                    <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'photo'})}</label>
                                            <div className='d-flex'>
                                            <span className="btn btn-file">
                                                <i className="fa fa-upload my-2" aria-hidden="true"></i>{intl.formatMessage({id: 'upload'})} <input type="file"
                                                    //  {...formik.getFieldProps('document'+i)}
                                                    id='userProfileImgUdt'
                                                    onChange={handleImagePreview}
                                                    name={'profile_image'} />                                                
                                            </span>
                                            {imgPre &&
                                            <><div className='position-relative'><img className='w-50 h-100' src={imagePreview} alt="image preview"/>
                                            <a onClick={(e) => imgRemove()} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"></rect></svg></span></a></div></>}
                                            </div>
                                        </div>                                
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'aadhar_number'})}</label>
                                            <div className="input-group mb-3 input_prepend">
                                                <input type="text" min="0" {...formik.getFieldProps('aadhar_number')} onChange={(e) => formik.setFieldValue("aadhar_number", e.target?.value.replace(/[^0-9]/g, ""))} className="form-control" placeholder="Enter Aadhar" maxLength={12} />
                                            </div>
                                            {formik.touched.aadhar_number && formik.errors.aadhar_number && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.aadhar_number}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pan_number'})}</label>
                                            <div className="input-group mb-3 input_prepend">
                                                <input type="text" {...formik.getFieldProps('pan_number')} onChange={(e) => formik.setFieldValue("pan_number", e.target?.value.replace(/[^a-zA-Z0-9]/g, ""))} className="form-control" placeholder="Enter PAN" maxLength={10} />
                                            </div>
                                            {formik.touched.pan_number && formik.errors.pan_number && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.pan_number}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'date_of_birth'})}</label>
                                            <div className="input-group mb-3">
                                                <input type="date" {...formik.getFieldProps('dob')} className="form-control" placeholder="date" />
                                            </div>
                                            {formik.touched.dob && formik.errors.dob && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.dob}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'date_of_joining'})}</label>
                                            <div className="input-group mb-3">
                                                <input type="date" {...formik.getFieldProps('date_of_joining')} className="form-control" placeholder="date" />
                                            </div>
                                            {formik.touched.date_of_joining && formik.errors.date_of_joining && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.date_of_joining}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {/* <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'official_email_id'})}</label>
                                            <div className="input-group mb-3">
                                                <input type="email" {...formik.getFieldProps('o_email')} className="form-control" placeholder="Enter your email" />
                                            </div>
                                            {formik.touched.o_email && formik.errors.o_email && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.o_email}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div> */}
                                        </div>
                                        <div className='text-center'>
                                            <button
                                                type='submit'
                                                
                                                className='btn btn_primary text-primary'
                                                disabled={formik.isSubmitting}
                                            >
                                                {!isLoading && <span className='indicator-label'>{intl.formatMessage({id: 'submit'})}
                                                    <KTSVG
                                                        path='/media/custom/save_white.svg'
                                                        className='svg-icon-3 svg-icon-primary ms-2' />
                                                </span>}
                                                {isLoading && (
                                                    <span className='indicator-progress' style={{ display: 'block' }}>
                                                        {intl.formatMessage({id: 'please_wait'})}...{' '}
                                                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                        </form>
                                    </div>
                                    </div>
                                    <div className={tabInfo == 'personalDetails' ? "tab-pane fade show active" : "tab-pane fade"} id={"personalDetails"+currentUserId?.id} role="tabpanel" aria-labelledby="personalDetails-tab">
                                    <div className='mb-9' style={{ height: '100%', width: '100%',}}>
                                    <form noValidate onSubmit={formik2.handleSubmit}>
                                    <div className='row'>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gender'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="form-select btn btn-sm w-100 text-start" {...formik2.getFieldProps('gender')}>
                                                <option disabled value="">Select</option>
                                                {dropdowns.gender?.map((branchValue:any,i:any)=> {
                                                    return (
                                                    <option value={branchValue.id} key={i}>{branchValue.option_value}</option>
                                                    )
                                                    })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'blood_group'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="form-select btn btn-sm w-100 text-start" {...formik2.getFieldProps('blood_group')}>
                                                <option disabled value="">Select</option>
                                                {dropdowns.blood_group?.map((branchValue:any,i:any)=> {
                                                    return (
                                                    <option value={branchValue.id} key={i}>{branchValue.option_value}</option>
                                                    )
                                                    })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'fathers_name'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formik2.getFieldProps('fathers_name')} placeholder=""/>
                                        </div>
                                        {formik2.touched.fathers_name && formik2.errors.fathers_name && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik2.errors.fathers_name}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'medical_condition'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formik2.getFieldProps('medical_condition')} placeholder=""/>
                                        </div>
                                        {formik2.touched.medical_condition && formik2.errors.medical_condition && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik2.errors.medical_condition}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>                                    
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'crm_id'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formik2.getFieldProps('crm_login_id')} placeholder=""/>
                                        </div>
                                        {formik2.touched.crm_login_id && formik2.errors.crm_login_id && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik2.errors.crm_login_id}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>                                     
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'crm_password'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formik2.getFieldProps('crm_login_password')} placeholder=""/>
                                        </div>
                                        {formik2.touched.crm_login_password && formik2.errors.crm_login_password && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik2.errors.crm_login_password}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>                                    
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'emergency_contact_person_name'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="text" {...formik2.getFieldProps('emergency_contact_person_name')} className="form-control" placeholder="" />
                                        </div>
                                        {formik2.touched.emergency_contact_person_name && formik2.errors.emergency_contact_person_name && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik2.errors.emergency_contact_person_name}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'emergency_contact_number'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend">
                                                <option value="">+91</option>
                                            </select>
                                            <input type="text" min="0" {...formik2.getFieldProps('emergency_contact_no')} onChange={(e) => formik2.setFieldValue("emergency_contact_no", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15} className="form-control" placeholder="Enter Phone Number" />
                                        </div>
                                        {formik2.touched.emergency_contact_no && formik2.errors.emergency_contact_no && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formik2.errors.emergency_contact_no}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>                      
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'emergency_contact_person_relation'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formik2.getFieldProps('relation_person')} placeholder=""/>
                                        </div>
                                        {formik2.touched.relation_person && formik2.errors.relation_person && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik2.errors.relation_person}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'sec_phone_number'})}</label>
                                            <div className="input-group mb-3 input_prepend">
                                                <select className="px-2 py-2 btn_secondary btn btn-sm prepend">
                                                    <option value="">+91</option>
                                                </select>
                                                <input type="text" min="0" {...formik2.getFieldProps('sec_mobile')} onChange={(e) => formik2.setFieldValue("sec_mobile", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15} className="form-control" placeholder="Enter your Phone Number" />
                                            </div>
                                            {formik2.touched.sec_mobile && formik2.errors.sec_mobile && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik2.errors.sec_mobile}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'marital_status'})}</label>
                                            <div className="input-group mb-3">
                                                <select className="form-select btn btn-sm w-100 text-start" {...formik2.getFieldProps('marital_status')} >
                                                    <option disabled value="">Select</option>
                                                    {dropdowns.marital_status?.map((branchValue:any,i:any)=> {
                                                    return (
                                                    <option value={branchValue.id} key={i}>{branchValue.option_value}</option>
                                                    )
                                                    })} 
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'anniversary_date'})}</label>
                                            <div className="input-group mb-3">
                                                <input type="date" {...formik2.getFieldProps('anniversary_date')} className="form-control" placeholder="date" />
                                            </div>
                                            {formik2.touched.anniversary_date && formik2.errors.anniversary_date && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik2.errors.anniversary_date}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'spouse_name'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" {...formik2.getFieldProps('spouse_name')} placeholder="" />
                                            </div>
                                            {formik2.touched.spouse_name && formik2.errors.spouse_name && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik2.errors.spouse_name}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'spouse_dob'})}</label>
                                            <div className="input-group">
                                                <input type="date" className="form-control" {...formik2.getFieldProps('spouse_dob')} placeholder="" />
                                            </div>
                                            {formik2.touched.spouse_dob && formik2.errors.spouse_dob && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik2.errors.spouse_dob}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'number_of_kids'})}</label>
                                            <div className="input-group">
                                                <input type="number" className="form-control" {...formik2.getFieldProps('no_of_kids')} placeholder=""/>
                                            </div>
                                            {formik2.touched.no_of_kids && formik2.errors.no_of_kids && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik2.errors.no_of_kids}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: '1st_kid_name'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" {...formik2.getFieldProps('kid_name_1')} placeholder=""/>
                                            </div>
                                            {formik2.touched.kid_name_1 && formik2.errors.kid_name_1 && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik2.errors.kid_name_1}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: '2nd_kid_name'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" {...formik2.getFieldProps('kid_name_2')} placeholder=""/>
                                            </div>
                                            {formik2.touched.kid_name_2 && formik2.errors.kid_name_2 && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik2.errors.kid_name_2}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: '3rd_kid_name'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" {...formik2.getFieldProps('kid_name_3')} placeholder=""/>
                                            </div>
                                            {formik2.touched.kid_name_3 && formik2.errors.kid_name_3 && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik2.errors.kid_name_3}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div> 
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'permanent_address'})}</label>
                                            <div className="input-group">
                                                <textarea rows={4} {...formik2.getFieldProps('permenent_address')} className="form-control" placeholder="Permanent Address" />
                                            </div>
                                            {formik2.touched.permenent_address && formik2.errors.permenent_address && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik2.errors.permenent_address}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'correspondence_address'})}</label>
                                            <div className="input-group">
                                                <textarea rows={4} {...formik2.getFieldProps('correspondence_address')} className="form-control" placeholder="Correspondence Address" />
                                            </div>
                                            {formik2.touched.correspondence_address && formik2.errors.correspondence_address && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik2.errors.correspondence_address}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        </div>
                                        <div className='text-center'>
                                            <button
                                                type='submit'
                                                id='kt_sign_up_submit2'
                                                className='btn btn_primary text-primary'
                                                disabled={formik2.isSubmitting}
                                            >
                                                {!isLoading && <span className='indicator-label'>{intl.formatMessage({id: 'submit'})}
                                                    <KTSVG
                                                        path='/media/custom/save_white.svg'
                                                        className='svg-icon-3 svg-icon-primary ms-2' />
                                                </span>}
                                                {isLoading && (
                                                    <span className='indicator-progress' style={{ display: 'block' }}>
                                                        {intl.formatMessage({id: 'please_wait'})}...{' '}
                                                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                        </form>
                                        </div>
                                    </div>
                                    <div className={tabInfo == 'professionalDetails' ? "tab-pane fade show active" : "tab-pane fade"} id={"professionalDetails"+currentUserId?.id} role="tabpanel" aria-labelledby="professionalDetails-tab">
                                    <div className='mb-9' style={{ height: '100%', width: '100%',}}>
                                    <form noValidate onSubmit={formik3.handleSubmit}>
                                        <div className='row'>
                                        <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'year_of_experiance'})}</label>
                                        <div className="input-group">
                                            <input type="number" className="form-control" {...formik3.getFieldProps('years_of_experience')} placeholder=""/>
                                        </div>
                                        {formik3.touched.years_of_experience && formik3.errors.years_of_experience && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik3.errors.years_of_experience}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'last_company_name'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formik3.getFieldProps('last_company')} placeholder=""/>
                                        </div>
                                        {formik3.touched.last_company && formik3.errors.last_company && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik3.errors.last_company}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    {/* <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'country'})}</label>
                                            <div className="input-group">
                                            <select className="form-select btn-sm text-start" {...formik3.getFieldProps('country')} onChange={async (e) => {
                                                formik3.setFieldValue("country", e.target.value);
                                                let states = dropdowns.state?.filter((state:any) => e.target.value == state.country_id);
                                                setState(states);
                                                formik3.setFieldValue("state", '');
                                                formik3.setFieldValue("city", '');
                                                setCity([]);
                                            }} >
                                                <option disabled value="">Select</option>
                                                {dropdowns.country?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                    return(
                                                        <option value={data.id} key={i}>{data.name}</option>
                                                )})}
                                            </select> 
                                            </div> 
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'state'})}</label>
                                            <div className="input-group">
                                            <select className="form-select btn-sm text-start" {...formik3.getFieldProps('state')} onChange={async (e) => {
                                                formik3.setFieldValue("state", e.target.value);                                               
                                                let cities = dropdowns.city?.filter((city:any) => e.target.value == city.state_id);
                                                setCity(cities);
                                            }} >
                                                <option disabled value="">Select</option>
                                                {state.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                    return(
                                                    <option value={data.id} key={i}>{data.name}</option>
                                                )})}
                                            </select>
                                            </div>  
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="form-group mb-4">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                                            <div className="input-group">
                                            <select className="form-select btn-sm text-start" {...formik3.getFieldProps('city')}>
                                                <option disabled value="">Select</option>
                                                {city?.map((data: { id: string | number | readonly string[] | undefined; name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => {
                                                    return(
                                                        <option value={data.id} key={i}>{data.name}</option>
                                                )})}
                                            </select> 
                                            </div> 
                                        </div>
                                    </div> */}
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formik3.getFieldProps('city')} placeholder=""/>
                                        </div>
                                        {formik3.touched.city && formik3.errors.city && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik3.errors.city}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'duration'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formik3.getFieldProps('duration')} placeholder=""/>
                                        </div>
                                        {formik3.touched.duration && formik3.errors.duration && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik3.errors.duration}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'official_phone_number'})}</label>
                                            <div className="input-group mb-3 input_prepend">
                                                <select className="px-2 py-2 btn_secondary btn btn-sm prepend">
                                                    <option value="date">+91</option>
                                                </select>
                                                <input type="text" min="0" {...formik3.getFieldProps('official_mobile_number')} onChange={(e) => formik3.setFieldValue("official_mobile_number", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={15} className="form-control" placeholder="Enter Phone text"/>
                                            </div>
                                            {formik3.touched.official_mobile_number && formik3.errors.official_mobile_number && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik3.errors.official_mobile_number}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'official_email_id'})}</label>
                                            <div className="input-group mb-3">
                                                <input type="email" {...formik3.getFieldProps('official_mail')} className="form-control" placeholder="Enter your email" />
                                            </div>
                                            {formik3.touched.official_mail && formik3.errors.official_mail && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik3.errors.official_mail}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'company_address'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formik3.getFieldProps('local_address')} placeholder=""/>
                                        </div>
                                        {formik3.touched.local_address && formik3.errors.local_address && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik3.errors.local_address}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label"> {intl.formatMessage({id: 'target_for_the_fy'})}<small>(in Rs.)</small></label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formik3.getFieldProps('target_for_fy_rs')} onChange={(e) => formik3.setFieldValue("target_for_fy_rs", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formik3.touched.target_for_fy_rs && formik3.errors.target_for_fy_rs && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik3.errors.target_for_fy_rs}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'target_for_the_fy'})} <small>(in Units)</small></label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formik3.getFieldProps('target_for_fy_units')} onChange={(e) => formik3.setFieldValue("target_for_fy_units", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formik3.touched.target_for_fy_units && formik3.errors.target_for_fy_units && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik3.errors.target_for_fy_units}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'monthly_ctc'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formik3.getFieldProps('monthly_ctc')} onChange={(e) => formik3.setFieldValue("monthly_ctc", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formik3.touched.monthly_ctc && formik3.errors.monthly_ctc && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik3.errors.monthly_ctc}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'incentive'})} %</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formik3.getFieldProps('incentive')} onChange={(e) => formik3.setFieldValue("incentive", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formik3.touched.incentive && formik3.errors.incentive && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik3.errors.incentive}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'monthly_take_home'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formik3.getFieldProps('monthly_take_home')} onChange={(e) => formik3.setFieldValue("monthly_take_home", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formik3.touched.monthly_take_home && formik3.errors.monthly_take_home && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik3.errors.monthly_take_home}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                        </div>
                                        <div className='text-center'>
                                            <button
                                                type='submit'
                                                id='kt_sign_up_submit3'
                                                className='btn btn_primary text-primary'
                                                disabled={formik3.isSubmitting}
                                            >
                                                {!isLoading && <span className='indicator-label'>{intl.formatMessage({id: 'submit'})}
                                                    <KTSVG
                                                        path='/media/custom/save_white.svg'
                                                        className='svg-icon-3 svg-icon-primary ms-2' />
                                                </span>}
                                                {isLoading && (
                                                    <span className='indicator-progress' style={{ display: 'block' }}>
                                                        {intl.formatMessage({id: 'please_wait'})}...{' '}
                                                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                        </form>
                                        </div>
                                    </div>
                                    <div className={tabInfo == 'financialDetails' ? "tab-pane fade show active" : "tab-pane fade"} id={"financialDetails"+currentUserId?.id} role="tabpanel" aria-labelledby="financialDetails-tab">
                                    <div className='mb-9' style={{ height: '100%', width: '100%',}}>
                                    <form noValidate onSubmit={formik4.handleSubmit}>
                                    <div className='row'>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'base_salary'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" {...formik4.getFieldProps('base_salary')} onChange={(e) => formik4.setFieldValue("base_salary", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                            </div>
                                            {formik4.touched.base_salary && formik4.errors.base_salary && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik4.errors.base_salary}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pf'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" {...formik4.getFieldProps('pf')} onChange={(e) => formik4.setFieldValue("pf", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                            </div>
                                            {formik4.touched.pf && formik4.errors.pf && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik4.errors.pf}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'hra'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" {...formik4.getFieldProps('hra')} onChange={(e) => formik4.setFieldValue("hra", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                            </div>
                                            {formik4.touched.hra && formik4.errors.hra && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik4.errors.hra}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_ctc'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" {...formik4.getFieldProps('total_ctc')} onChange={(e) => formik4.setFieldValue("total_ctc", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                            </div>
                                            {formik4.touched.total_ctc && formik4.errors.total_ctc && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik4.errors.total_ctc}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'mediclaim'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" {...formik4.getFieldProps('mediclaim')} onChange={(e) => formik4.setFieldValue("mediclaim", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                            </div>
                                            {formik4.touched.mediclaim && formik4.errors.mediclaim && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik4.errors.mediclaim}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'conveyance'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" {...formik4.getFieldProps('conveyance')} onChange={(e) => formik4.setFieldValue("conveyance", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                            </div>
                                            {formik4.touched.conveyance && formik4.errors.conveyance && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik4.errors.conveyance}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'misc'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" {...formik4.getFieldProps('misc')} onChange={(e) => formik4.setFieldValue("misc", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                            </div>
                                            {formik4.touched.misc && formik4.errors.misc && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik4.errors.misc}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'name_as_per_bank_record'})} 
                                            {/* <small>(As Per Bank record)</small> */}
                                            </label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" {...formik4.getFieldProps('bank_record_name')} placeholder=""/>
                                            </div>
                                            {formik4.touched.bank_record_name && formik4.errors.bank_record_name && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik4.errors.bank_record_name}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'bank_name'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" {...formik4.getFieldProps('bank_name')} placeholder=""/>
                                            </div>
                                            {formik4.touched.bank_name && formik4.errors.bank_name && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik4.errors.bank_name}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'account_no'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" {...formik4.getFieldProps('acc_number')} onChange={(e) => formik4.setFieldValue("acc_number", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={17} placeholder=""/>
                                            </div>
                                            {formik4.touched.acc_number && formik4.errors.acc_number && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik4.errors.acc_number}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'ifsc_code'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" {...formik4.getFieldProps('ifsc_code')} maxLength={11} placeholder=""/>
                                            </div>
                                            {formik4.touched.ifsc_code && formik4.errors.ifsc_code && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik4.errors.ifsc_code}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'branch_name'})}</label>
                                            <div className="input-group">
                                                <input type="text" className="form-control" {...formik4.getFieldProps('branch_name')} placeholder=""/>
                                            </div>
                                            {formik4.touched.branch_name && formik4.errors.branch_name && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik4.errors.branch_name}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                        <div className='text-center'>
                                            <button
                                                type='submit'
                                                id='kt_sign_up_submit4'
                                                className='btn btn_primary text-primary'
                                                disabled={formik4.isSubmitting}
                                            >
                                                {!isLoading && <span className='indicator-label'>{intl.formatMessage({id: 'submit'})}
                                                    <KTSVG
                                                        path='/media/custom/save_white.svg'
                                                        className='svg-icon-3 svg-icon-primary ms-2' />
                                                </span>}
                                                {isLoading && (
                                                    <span className='indicator-progress' style={{ display: 'block' }}>
                                                        {intl.formatMessage({id: 'please_wait'})}...{' '}
                                                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                        </form>
                                        </div>
                                    </div>  
                                    <div className={tabInfo == 'goalDetails' ? "tab-pane fade show active" : "tab-pane fade"} id={"goalDetails"+currentUserId?.id} role="tabpanel" aria-labelledby="goalDetails-tab">
                                        <div className='mb-9' style={{ height: '100%', width: '100%',}}>
                                            <form noValidate onSubmit={formik5.handleSubmit}>
                                            <div className='row'>
                                                <div className="col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'annual_target'})}</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" {...formik5.getFieldProps('annual_target')} onChange={(e) => formik5.setFieldValue("annual_target", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                                    </div>
                                                    {formik5.touched.annual_target && formik5.errors.annual_target && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik5.errors.annual_target}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>
                                                {/* <div className="col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'status_changed'})}</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" {...formik5.getFieldProps('status_changed')} onChange={(e) => formik5.setFieldValue("status_changed", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                                    </div>
                                                    {formik5.touched.status_changed && formik5.errors.status_changed && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik5.errors.status_changed}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div> */}
                                                <div className="col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_units_commited'})}</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" {...formik5.getFieldProps('no_of_units_committed')} onChange={(e) => formik5.setFieldValue("no_of_units_committed", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                                    </div>
                                                    {formik5.touched.no_of_units_committed && formik5.errors.no_of_units_committed && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik5.errors.no_of_units_committed}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>
                                                <div className="col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_sales'})}</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" {...formik5.getFieldProps('no_of_sales')} onChange={(e) => formik5.setFieldValue("no_of_sales", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                                    </div>
                                                    {formik5.touched.no_of_sales && formik5.errors.no_of_sales && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik5.errors.no_of_sales}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>                                    
                                                <div className="col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'goal_calls'})}</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" {...formik5.getFieldProps('goal_calls')} onChange={(e) => formik5.setFieldValue("goal_calls", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                                    </div>
                                                    {formik5.touched.goal_calls && formik5.errors.goal_calls && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik5.errors.goal_calls}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>                                    
                                                <div className="col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'goal_talktime'})}</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" {...formik5.getFieldProps('goal_talktime')} onChange={(e) => formik5.setFieldValue("goal_talktime", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                                    </div>
                                                    {formik5.touched.goal_talktime && formik5.errors.goal_talktime && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik5.errors.goal_talktime}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>                                    
                                                <div className="col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'goal_leads_generated'})}</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" {...formik5.getFieldProps('goal_leads_generated')} onChange={(e) => formik5.setFieldValue("goal_leads_generated", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                                    </div>
                                                    {formik5.touched.goal_leads_generated && formik5.errors.goal_leads_generated && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik5.errors.goal_leads_generated}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>                                    
                                                <div className="col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'goal_leads_converted'})}</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" {...formik5.getFieldProps('goal_leads_converted')} onChange={(e) => formik5.setFieldValue("goal_leads_converted", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                                    </div>
                                                    {formik5.touched.goal_leads_converted && formik5.errors.goal_leads_converted && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik5.errors.goal_leads_converted}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>                                    
                                                <div className="col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'goal_site_vist'})}</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" {...formik5.getFieldProps('goal_site_visit')} onChange={(e) => formik5.setFieldValue("goal_site_visit", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                                    </div>
                                                    {formik5.touched.goal_site_visit && formik5.errors.goal_site_visit && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik5.errors.goal_site_visit}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>                                    
                                                <div className="col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'goal_meetings'})}</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" {...formik5.getFieldProps('goal_meetings')} onChange={(e) => formik5.setFieldValue("goal_meetings", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                                    </div>
                                                    {formik5.touched.goal_meetings && formik5.errors.goal_meetings && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik5.errors.goal_meetings}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>                                    
                                                <div className="col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'goal_bookings'})}</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" {...formik5.getFieldProps('goal_bookings')} onChange={(e) => formik5.setFieldValue("goal_bookings", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                                    </div>
                                                    {formik5.touched.goal_bookings && formik5.errors.goal_bookings && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik5.errors.goal_bookings}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>                                    
                                                <div className="col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'goal_revenue'})}</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" {...formik5.getFieldProps('goal_revenue')} onChange={(e) => formik5.setFieldValue("goal_revenue", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                                    </div>
                                                    {formik5.touched.goal_revenue && formik5.errors.goal_revenue && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik5.errors.goal_revenue}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>
                                                {/* <div className="col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'incentives'})}</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" {...formik5.getFieldProps('incentives')} onChange={(e) => formik5.setFieldValue("incentives", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                                    </div>
                                                    {formik5.touched.incentives && formik5.errors.incentives && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik5.errors.incentives}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div> */}
                                                <div className="col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'discount'})}</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" {...formik5.getFieldProps('discount')} onChange={(e) => formik5.setFieldValue("discount", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                                    </div>
                                                    {formik5.touched.discount && formik5.errors.discount && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik5.errors.discount}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>
                                                <div className="col-md-6 col-12 mb-3">
                                                    <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'turnover'})}</label>
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" {...formik5.getFieldProps('turnover')} onChange={(e) => formik5.setFieldValue("turnover", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                                    </div>
                                                    {formik5.touched.turnover && formik5.errors.turnover && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik5.errors.turnover}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>                                    
                                            </div>
                                                <div className='text-center'>
                                                    <button
                                                        type='submit'
                                                        id='kt_sign_up_submit5'
                                                        className='btn btn_primary text-primary'
                                                        disabled={formik5.isSubmitting}
                                                    >
                                                        {!isLoading && <span className='indicator-label'>{intl.formatMessage({id: 'submit'})}
                                                            <KTSVG
                                                                path='/media/custom/save_white.svg'
                                                                className='svg-icon-3 svg-icon-primary ms-2' />
                                                        </span>}
                                                        {isLoading && (
                                                            <span className='indicator-progress' style={{ display: 'block' }}>
                                                                {intl.formatMessage({id: 'please_wait'})}...{' '}
                                                                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> :
            <div className="card bg_primary">
                <div className="card-body d-flex justify-content-between">
                    <div>
                        <h5 className='text-white'>{intl.formatMessage({id: 'lead_details'})}</h5>
                    </div>
                    <button onClick={minimaximize} className="mx-3 btn p-0">
                        <i className="fas fa-window-maximize text-white"></i>
                    </button>
                    <button type='button' id='kt_usersettings_edit_close' data-bs-dismiss="offcanvas" onClick={() => {
                        closeDialogue();
                        }} className="mx-3 btn p-0">
                        <i className="fas fa-times text-white"></i>
                    </button>
                </div>
            </div>
            }
        </div>
    )
}


export {EditUser}