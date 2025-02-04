import React,{FC, useEffect, useState} from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../_metronic/helpers';
import {useFormik} from 'formik'
import * as Yup from 'yup'
import { Toast } from 'bootstrap';
import { getUsersDropdown, saveUser, saveUserFinancial, saveUserGoal, saveUserPersonal, saveUserProfessional } from './core/_requests';
import {useIntl} from 'react-intl';
import moment from 'moment';
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
    branch: "",
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
}

type Props = {
    setUser?: any
}

const AddUserSettings:  FC<Props> = (props) => {

    const intl = useIntl();
    const {setUser} = props    
    const [loading, setLoading] = useState(false)
    const [dropdowns, setDropdowns] = useState<any>({});
    const [message, setMessage] = useState(false);
    const [imgPre, setImgPre] = useState(false);
    const [imagePreview, setImagePreview] = useState<any>(null);
    const [imageFile, setImageFile] = useState(null);
    const [state, setState] = useState<any[]>([]);
    const [userId, setUserId] = useState<any>('');
    const [selectedDesignation, setSelectedDesignation] = useState<any>('');
    const [selectedDepartment, setSelectedDepartment] = useState<any>('');
    const [selectedPortfolioHead, setSelectedPortfolioHead] = useState<any>('');
    const [selectedTeamLeader, setSelectedTeamLeader] = useState<any>('');

    var registrationSchema;
    if(selectedDesignation != 1) {
        registrationSchema = Yup.object().shape({
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
            official_mail: Yup.string()
            .email('Wrong email format')
            .min(3, 'Minimum 3 characters')
            .max(50, 'Maximum 50 characters'),
            designation: Yup.string()
            .required('Designation is required'),
            pass: Yup.string()
            .required('Password is required')
            .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),
            password: Yup.string()
            .required()
            .oneOf([Yup.ref("pass"), null], "Passwords must match"),
            aadhar_number: Yup.string()
            .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
            .min(12, "Aadhar number must be 12 characters")
            .max(12, "Aadhar number must be 12 characters"),
            pan_number: Yup.string()
            .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
            .min(10, "PAN number must be 10 characters")
            .max(10, "PAN number must be 10 characters"),
            team_leader: Yup.string()
            .required('Team Leader is required'), 
            department: Yup.string(),
            branch: Yup.string(),
            p_phone_number: Yup.string()
            .matches(/^[^!@#$%^&*+=<>:;|~]*$/, "Special Characters Not Allowed")
            .matches(/^[\s\d)(-]+$/, "Special Characters Not Allowed")
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
            .max(25, 'Maximum 25 characters'),
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
            .max(90, 'Maximum 90 characters'),
            mediclaim: Yup.string()
            .max(9, 'Maximum 9 characters'),
            conveyance: Yup.string()
            .max(9, 'Maximum 9 characters'),
            misc: Yup.string()
            .max(9, 'Maximum 9 characters'),
            total_ctc: Yup.string()
            // .matches(/^[0-9]+\.[0-9]+$/, "Special Characters Not Allowed")
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
            employee_id: Yup.string()
            .max(9, 'Maximum 9 characters'),              
      })} else {
        registrationSchema = Yup.object().shape({
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
            official_mail: Yup.string()
            .email('Wrong email format')
            .min(3, 'Minimum 3 characters')
            .max(50, 'Maximum 50 characters'),
            designation: Yup.string()
            .required('Designation is required'),
            pass: Yup.string()
            .required('Password is required')
            .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"),
            password: Yup.string()
            .required()
            .oneOf([Yup.ref("pass"), null], "Passwords must match"),
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
            // branch: Yup.string(),
            p_phone_number: Yup.string()
            .matches(/^[^!@#$%^&*+=<>:;|~]*$/, "Special Characters Not Allowed")
            .matches(/^[\s\d)(-]+$/, "Special Characters Not Allowed")
            .min(7, 'Minimum 7 characters')
            .max(15, 'Maximum 15 characters'),
            o_phone_number: Yup.string()
            .matches(/^[0-9]+$/, "Special Characters Not Allowed")
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
            .max(25, 'Maximum 25 characters'),
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
            total_ctc: Yup.number() 
            // .matches(/^[-+]?[0-9]+\.[0-9]+$/, "Special Characters Not Allowed")           
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
            .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
            .max(9, 'Maximum 9 characters'),
            discount: Yup.string()
            .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
            .max(9, 'Maximum 9 characters'),
            turnover: Yup.string()
            .matches(/^[a-zA-Z0-9]+$/, "Special Characters Not Allowed")
            .max(9, 'Maximum 9 characters'), 
            employee_id: Yup.string()
            .max(9, 'Maximum 9 characters'), 
          })
      }
      

    const formik = useFormik({
        initialValues,
        validationSchema: registrationSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {   
            var formData = new FormData();
            formData.append('first_name', values.first_name);
            formData.append('last_name', values.last_name);
            formData.append('employee_id', values.employee_id);
            formData.append('designation', values.designation);
            formData.append('department', values.department);
            formData.append('p_phone_number', values.p_phone_number);
            formData.append('email', values.email);
            formData.append('o_phone_number', values.o_phone_number);
            formData.append('o_email', values.o_email);
            formData.append('aadhar_number', values.aadhar_number);
            formData.append('pan_number', values.pan_number);
            formData.append('dob', values.dob);
            formData.append('date_of_joining', values.date_of_joining);
            formData.append('password', values.password);
            formData.append('team_leader', values.team_leader);
            formData.append('portfolio_head', values.portfolio_head);
            formData.append('language', values.language);
            formData.append('profile_image', imageFile!);

            const saveUserData = await saveUser(formData)
    
            if(saveUserData.status == 200) {                
                setLoading(false)
                document.getElementById('kt_usersettings_close')?.click();
                document.getElementById('fgbirgiebjrtjegtrtbkdffh')?.click();
                // setUserId(saveUserData.output?.id);
                resetForm();
                imgRemove();
                setSelectedDesignation('');
                setSelectedDepartment('');
                setSelectedPortfolioHead('');
                setSelectedTeamLeader('');
                var toastEl = document.getElementById('userToastAdd');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            } else if(saveUserData.status == 400) {
                setLoading(false)
                var toastEl = document.getElementById('userEmailExist');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
        },
    })

    const formikPersonal = useFormik({
        initialValues,
        // validationSchema: registrationSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            var formData = new FormData();
            formData.append('user_id', userId);
            formData.append('crm_login_id', values.crm_login_id);
            formData.append('crm_login_password', values.crm_login_password);
            formData.append('gender', values.gender);
            formData.append('blood_group', values.blood_group);
            formData.append('sec_mobile', values.sec_mobile);
            formData.append('permenent_address', values.permenent_address);
            formData.append('correspondence_address', values.correspondence_address);
            formData.append('fathers_name', values.fathers_name);
            formData.append('marital_status', values.marital_status);
            formData.append('anniversary_date', values.anniversary_date);
            formData.append('spouse_name', values.spouse_name);
            formData.append('spouse_dob', values.spouse_dob);
            formData.append('medical_condition', values.medical_condition);
            formData.append('emergency_contact_no', values.emergency_contact_no);
            formData.append('emergency_contact_person_name', values.emergency_contact_person_name);
            formData.append('relation_person', values.relation_person);
            formData.append('no_of_kids', values.no_of_kids);
            formData.append('kid_name_1', values.kid_name_1);
            formData.append('kid_name_2', values.kid_name_2);
            formData.append('kid_name_3', values.kid_name_3);

            const saveUserData = await saveUserPersonal(formData)
    
            if(saveUserData.status == 200) {                
                setLoading(false)
                // document.getElementById('kt_usersettings_close')?.click();
                var toastEl = document.getElementById('userToastAdd');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                // setUser(saveUserData.output)
                resetForm();
                imgRemove();                                      
            } else if(saveUserData.status == 401) {
                setLoading(false)
                var toastEl = document.getElementById('userEmailExist');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }
    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
        },
    })            
    
    const formikProfessional = useFormik({
        initialValues,
        // validationSchema: registrationSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            var formData = new FormData();
            
            formData.append('user_id', userId);
            formData.append('duration', values.duration);
            formData.append('years_of_experience', values.years_of_experience);
            formData.append('last_company', values.last_company);
            formData.append('official_mobile_number', values.official_mobile_number);
            formData.append('official_mail', values.official_mail);
            formData.append('local_address', values.local_address);
            formData.append('city', values.city);
            formData.append('target_for_fy_rs', values.target_for_fy_rs);
            formData.append('target_for_fy_units', values.target_for_fy_units);
            formData.append('monthly_ctc', values.monthly_ctc);
            formData.append('monthly_take_home', values.monthly_take_home);
            formData.append('incentive', values.incentive);

            const saveUserData = await saveUserProfessional(formData)
    
            if(saveUserData.status == 200) {                
                setLoading(false)
                // document.getElementById('kt_usersettings_close')?.click();
                var toastEl = document.getElementById('userToastAdd');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                // setUser(saveUserData.output)
                resetForm();
                imgRemove();                                      
            } else if(saveUserData.status == 401) {
                setLoading(false)
                var toastEl = document.getElementById('userEmailExist');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }
    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
        },
    })            
            
    const formikFinancial = useFormik({
        initialValues,
        // validationSchema: registrationSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            var formData = new FormData();  
            
            formData.append('user_id', userId);
            formData.append('base_salary', values.base_salary);
            formData.append('pf', values.pf);
            formData.append('hra', values.hra);
            formData.append('mediclaim', values.mediclaim);
            formData.append('conveyance', values.conveyance);
            formData.append('misc', values.misc);
            formData.append('total_ctc', values.total_ctc);
            formData.append('bank_record_name', values.bank_record_name);
            formData.append('bank_name', values.bank_name);
            formData.append('acc_number', values.acc_number);
            formData.append('ifsc_code', values.ifsc_code);
            formData.append('branch_name', values.branch_name);            
            formData.append('past_employment_history', values.past_employment_history);
            
            const saveUserData = await saveUserFinancial(formData)
    
            if(saveUserData.status == 200) {                
                setLoading(false)
                // document.getElementById('kt_usersettings_close')?.click();
                var toastEl = document.getElementById('userToastAdd');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                // setUser(saveUserData.output)
                resetForm();
                imgRemove();                                      
            } else if(saveUserData.status == 401) {
                setLoading(false)
                var toastEl = document.getElementById('userEmailExist');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }
    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
        },
    })


    const formikGoal = useFormik({
        initialValues,
        // validationSchema: registrationSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          setLoading(true)
          try {
            var formData = new FormData();

            formData.append('user_id', userId);
            formData.append('goal_calls', values.goal_calls);
            formData.append('goal_talktime', values.goal_talktime);
            formData.append('goal_leads_generated', values.goal_leads_generated);
            formData.append('goal_leads_converted', values.goal_leads_converted);
            formData.append('goal_site_visit', values.goal_site_visit);
            formData.append('goal_meetings', values.goal_meetings);
            formData.append('goal_bookings', values.goal_bookings);
            formData.append('goal_revenue', values.goal_revenue);
            formData.append('no_of_units_committed', values.no_of_units_committed);
            formData.append('annual_target', values.annual_target);
            formData.append('no_of_sales', values.no_of_sales);
            formData.append('turnover', values.turnover);
            formData.append('discount', values.discount);
            formData.append('incentives', values.incentives);
            formData.append('status_changed', values.status_changed);   
            
            
            const saveUserData = await saveUserGoal(formData)
    
            if(saveUserData.status == 200) {                
                setLoading(false)
                // document.getElementById('kt_usersettings_close')?.click();
                var toastEl = document.getElementById('userToastAdd');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
                // setUser(saveUserData.output)
                resetForm();
                imgRemove();                                      
            } else if(saveUserData.status == 401) {
                setLoading(false)
                var toastEl = document.getElementById('userEmailExist');
                const bsToast = new Toast(toastEl!);
                bsToast.show();
            }
    
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            setSubmitting(false)
            setLoading(false)
          }
        },
    })       

    const dropdownsList = async (id:any) => {
        const response = await getUsersDropdown(id)
        setDropdowns(response.output)
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
            (document.getElementById('userProfileImg') as HTMLInputElement).value = '';
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
            (document.getElementById('userProfileImg') as HTMLInputElement).value = '';
            var toastEl = document.getElementById('usrimgFileErr');
            const bsToast = new Toast(toastEl!);
            bsToast.show();
           }  
        }
    }

    const imgRemove = () => {
        setImageFile(null);
        setImagePreview('');
        setImgPre(false);
        (document.getElementById('userProfileImg') as HTMLInputElement).value = '';
    }

    useEffect(() => {
        dropdownsList(0);
    }, []);
      
    return(         
        <><div className='card shadow-none rounded w-100'>            
            <div aria-atomic="true" aria-live="assertive" className="toast bg_primary p-0 text-white position-fixed end-0 bottom-0" id="myToastAdd">
                <div className="toast-header">
                    <strong className="me-auto">{intl.formatMessage({id: 'success'})}</strong>
                    <button aria-label="Close" className="btn-close btn-close-color-white" 
                                data-bs-dismiss="toast" type="button">
                    </button> 
                </div>
                <div className="toast-body">
                    <div>{intl.formatMessage({id: 'user_created_successfully'})}!</div>
                </div>
            </div>
            <div className='card-header w-100 d-flex align-items-center justify-content-between' id='kt_usersettings_header'>
                <h3 className='card-title fw-bolder text-dark'>{intl.formatMessage({id: 'add_user'})}</h3>
                <div className='card-toolbar'>
                    <button
                        type='button'
                        className='btn btn-sm btn-icon btn-active-light-primary me-n5'
                        id='kt_usersettings_close'
                    >
                        <img src={toAbsoluteUrl('/media/custom/cancel_black.svg')} className="svg_icon" alt='' />
                    </button>
                </div>
            </div>            
            <div className='card-body position-relative' id='kt_usersettings_body'>
                <div className="accordion" id="accordionExample">                    
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                {intl.formatMessage({id: 'basic_details'})}
                            </button>
                        </h2>
                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <form noValidate onSubmit={formik.handleSubmit}>
                                <div className="accordion-body">
                                    <div className="row">
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
                                                    <option value="date">+91</option>
                                                </select>
                                                <input type="text" maxLength={15} {...formik.getFieldProps('p_phone_number')} onChange={(e) => formik.setFieldValue("p_phone_number", e.target?.value.replace(/[^0-9]/g, ""))} className="form-control" placeholder="Enter your Phone Number"/>
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
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'designation'})}</label>
                                            {/* <div className="input-group mb-3">
                                                <select 
                                                    {...formik.getFieldProps('designation')} 
                                                    className="form-select btn btn-sm w-100">
                                                    <option value=''>Select</option>
                                                    {dropdowns.roles?.map((designValue:any,i:any)=> {
                                                    return (
                                                    <option value={designValue.id} key={i}>{designValue.role_name}</option>
                                                    )
                                                    })} 
                                                </select>
                                            </div> */}
                                            <div className="input-group mb-3">
                                                <Select
                                                    options={dropdowns.roles}
                                                    components={makeAnimated()}
                                                    getOptionLabel={(option:any) => option.role_name}
                                                    getOptionValue={(option:any) => option.id}
                                                    // defaultValue={dropdowns.roles?.find((item:any) => selectedDesignation == item.id)}
                                                    value={dropdowns.roles?.find((item:any) => selectedDesignation == item.id) ?? []}
                                                    classNamePrefix="border-0 "
                                                    className={"w-100"}
                                                    // {...formik.getFieldProps('designation')}
                                                    onChange={(val:any) => {
                                                        if(val.id != 1) {
                                                        dropdownsList(val.id);
                                                        }
                                                        setSelectedDesignation(val.id)
                                                        formik.setFieldValue('designation', val.id);

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
                                                    className="form-select btn btn-sm w-100">
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
                                                    value={dropdowns.department?.find((item:any) => selectedDepartment == item.id) ?? []}
                                                    classNamePrefix="border-0 "
                                                    className={"w-100"}
                                                    // {...formik.getFieldProps('department')}
                                                    onChange={(val:any) => {
                                                        setSelectedDepartment(val.id)
                                                        formik.setFieldValue('department', val.id);
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
                                                {/* <select className="btn_secondary btn btn-sm w-100" autoFocus {...formik.getFieldProps('team_leader')}>
                                                    <option disabled value="">Select</option>
                                                    {dropdowns.team_leader?.map((team:any,i:any)=> {
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
                                                    value={dropdowns.team_leader?.find((item:any) => selectedTeamLeader == item.id) ?? []}
                                                    classNamePrefix="border-0 "
                                                    className={"w-100"}
                                                    // {...formik.getFieldProps('team_leader')}
                                                    onChange={(val:any) => {
                                                        setSelectedTeamLeader(val.id)
                                                        formik.setFieldValue('team_leader', val.id);
                                                    }}
                                                    placeholder={"Team leader"}
                                                    />
                                            </div>
                                            {formik.touched.team_leader && formik.errors.team_leader && 
                                                (   <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik.errors.team_leader}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'portfolio_head'})}</label>
                                            <div className="input-group mb-3">
                                                {/* <select className="btn_secondary btn btn-sm w-100" {...formik.getFieldProps('portfolio_head')}>
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
                                                    value={dropdowns.team_leader?.find((item:any) => selectedPortfolioHead == item.id) ?? []}
                                                    // defaultValue={dropdowns.roles?.find((item:any) => selectedDesignation == item.id)}
                                                    classNamePrefix="border-0 "
                                                    className={"w-100"}
                                                    // {...formik.getFieldProps('portfolio_head')}
                                                    onChange={(val:any) => {
                                                        setSelectedPortfolioHead(val.id)
                                                        formik.setFieldValue('portfolio_head', val.id);                                                        
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
                                                    id='userProfileImg'
                                                    onChange={handleImagePreview}
                                                    name={'profile_image'} />
                                                    
                                            </span>
                                            {imgPre &&
                                            <><div className='position-relative'><img src={imagePreview} alt="image preview" height={100} width={100} />
                                            <a onClick={(e) => imgRemove()} className="icon position-absolute px-1 top-0 end-0 rounded bg-gray border-0"><span className="svg-icon svg-icon-muted"><svg width="" height="30" viewBox="3 3 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="currentColor"></rect><rect x="7" y="15.3137" width="12" height="2" rx="1" transform="rotate(-45 7 15.3137)" fill="currentColor"></rect><rect x="8.41422" y="7" width="12" height="2" rx="1" transform="rotate(45 8.41422 7)" fill="currentColor"></rect></svg></span></a></div></>}
                                            </div>
                                        </div>                                                                                
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'mail_id'})}</label>
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
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'password'})}</label>
                                            <div className="input-group mb-3">
                                                <input type="password" {...formik.getFieldProps('pass')} className="form-control" placeholder="Enter your Password" />
                                            </div>
                                            {formik.touched.pass && formik.errors.pass && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.pass}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label required">{intl.formatMessage({id: 'confirm_password'})}</label>
                                            <div className="input-group mb-3">
                                                <input type="password" {...formik.getFieldProps('password')} className="form-control" placeholder="Confirm your Password" />
                                            </div>
                                            {formik.touched.password && formik.errors.password && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.password}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'aadhar_number'})}</label>
                                            <div className="input-group mb-3 input_prepend">
                                                <input type="text" maxLength={12} min="0" {...formik.getFieldProps('aadhar_number')} onChange={(e) => formik.setFieldValue("aadhar_number", e.target?.value.replace(/[^0-9]/g, ""))} className="form-control" placeholder="Enter Aadhar" />
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
                                                <input type="text" {...formik.getFieldProps('pan_number')} onChange={(e) => formik.setFieldValue("pan_number", e.target?.value.replace(/[^a-zA-Z0-9]/g, ""))} className="form-control" placeholder="Enter PAN" maxLength={10}/>
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
                                                <input type="date" max={moment().format("YYYY-MM-DD")} {...formik.getFieldProps('dob')} className="form-control" placeholder="date" />
                                            </div>
                                            {formik.touched.dob && formik.errors.dob && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formik.errors.dob}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>                                                                            
                                    </div>
                                </div>                                
                                <div className='text-center mb-6'>
                                    <button
                                        type='submit'
                                        
                                        className='btn btn_primary text-primary'
                                        disabled={formik.isSubmitting}
                                    >
                                        {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'submit'})}
                                            <KTSVG
                                                path='/media/custom/save_white.svg'
                                                className='svg-icon-3 svg-icon-primary ms-2' />
                                        </span>}
                                        {loading && (
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
                    {/* <div className="accordion-item">
                        <h2 className="accordion-header" id="headingTwo">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                {intl.formatMessage({id: 'personal_details'})}
                            </button>
                        </h2>
                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                            <form noValidate onSubmit={formikPersonal.handleSubmit}>
                                <div className="accordion-body">
                                    <div className="row"> 
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'gender'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="btn_secondary btn btn-sm w-100" {...formikPersonal.getFieldProps('gender')}>
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
                                            <select className="form-select btn btn-sm w-100" {...formikPersonal.getFieldProps('blood_group')}>
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
                                            <input type="text" className="form-control" {...formikPersonal.getFieldProps('fathers_name')} placeholder=""/>
                                        </div>
                                        {formikPersonal.touched.fathers_name && formikPersonal.errors.fathers_name && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikPersonal.errors.fathers_name}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'sec_phone_number'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend">
                                                <option value="date">+91</option>
                                            </select>
                                            <input type="text" min="0" {...formikPersonal.getFieldProps('sec_mobile')} onChange={(e) => formikPersonal.setFieldValue("sec_mobile", e.target?.value.replace(/[^0-9]/g, ""))} className="form-control" placeholder="Enter your sec. Phone No." maxLength={15}/>
                                        </div>
                                        {formikPersonal.touched.sec_mobile && formikPersonal.errors.sec_mobile && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikPersonal.errors.sec_mobile}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'marital_status'})}</label>
                                        <div className="input-group mb-3">
                                            <select className="form-select btn btn-sm w-100" {...formikPersonal.getFieldProps('marital_status')}>
                                                <option disabled value="">Select</option>
                                                {dropdowns.marital_status?.map((branchValue:any,i:any)=> {
                                                return (
                                                <option value={branchValue.id} key={i}>{branchValue.option_value}</option>
                                                )
                                                })} 
                                            </select>
                                        </div>
                                    </div>
                                        <>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'spouse_name'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikPersonal.getFieldProps('spouse_name')} placeholder="" />
                                        </div>
                                        {formikPersonal.touched.spouse_name && formikPersonal.errors.spouse_name && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikPersonal.errors.spouse_name}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'spouse_dob'})}</label>
                                        <div className="input-group">
                                            <input type="date" max={moment().format("YYYY-MM-DD")} className="form-control" {...formikPersonal.getFieldProps('spouse_dob')} placeholder="" />
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'number_of_kids'})}</label>
                                        <div className="input-group">
                                            <input type="number" className="form-control" {...formikPersonal.getFieldProps('no_of_kids')} placeholder=""/>
                                        </div>
                                        {formikPersonal.touched.no_of_kids && formikPersonal.errors.no_of_kids && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikPersonal.errors.no_of_kids}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: '1st_kid_name'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikPersonal.getFieldProps('kid_name_1')} placeholder=""/>
                                        </div>
                                        {formikPersonal.touched.kid_name_1 && formikPersonal.errors.kid_name_1 && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikPersonal.errors.kid_name_1}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: '2nd_kid_name'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikPersonal.getFieldProps('kid_name_2')} placeholder=""/>
                                        </div>
                                        {formikPersonal.touched.kid_name_2 && formikPersonal.errors.kid_name_2 && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikPersonal.errors.kid_name_2}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: '3rd_kid_name'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikPersonal.getFieldProps('kid_name_3')} placeholder=""/>
                                        </div>
                                        {formikPersonal.touched.kid_name_3 && formikPersonal.errors.kid_name_3 && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikPersonal.errors.kid_name_3}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div></>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'anniversary_date'})}</label>
                                        <div className="input-group mb-3">
                                            <input type="date" max={moment().format("YYYY-MM-DD")} {...formikPersonal.getFieldProps('anniversary_date')} className="form-control" placeholder="date" />
                                        </div>
                                        {formikPersonal.touched.anniversary_date && formikPersonal.errors.anniversary_date && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikPersonal.errors.anniversary_date}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'emergency_contact_person_name'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikPersonal.getFieldProps('emergency_contact_person_name')} placeholder=""/>
                                        </div>
                                        {formikPersonal.touched.emergency_contact_person_name && formikPersonal.errors.emergency_contact_person_name && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikPersonal.errors.emergency_contact_person_name}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'emergency_contact_number'})}</label>
                                        <div className="input-group mb-3 input_prepend">
                                            <select className="px-2 py-2 btn_secondary btn btn-sm prepend">
                                                <option value="date">+91</option>
                                            </select>
                                            <input type="text" min="0" {...formikPersonal.getFieldProps('emergency_contact_no')} onChange={(e) => formikPersonal.setFieldValue("emergency_contact_no", e.target?.value.replace(/[^0-9]/g, ""))} className="form-control" placeholder="Enter Phone Number" maxLength={15}/>
                                        </div>
                                        {formikPersonal.touched.emergency_contact_no && formikPersonal.errors.emergency_contact_no && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikPersonal.errors.emergency_contact_no}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'medical_condition'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikPersonal.getFieldProps('medical_condition')} placeholder=""/>
                                        </div>
                                        {formikPersonal.touched.medical_condition && formikPersonal.errors.medical_condition && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikPersonal.errors.medical_condition}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>                                     
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'crm_id'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikPersonal.getFieldProps('crm_login_id')} placeholder=""/>
                                        </div>
                                        {formikPersonal.touched.crm_login_id && formikPersonal.errors.crm_login_id && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikPersonal.errors.crm_login_id}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>                                     
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'crm_password'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikPersonal.getFieldProps('crm_login_password')} placeholder=""/>
                                        </div>
                                        {formikPersonal.touched.crm_login_password && formikPersonal.errors.crm_login_password && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikPersonal.errors.crm_login_password}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>                          
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'emergency_contact_person_relation'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikPersonal.getFieldProps('relation_person')} placeholder=""/>
                                        </div>
                                        {formikPersonal.touched.relation_person && formikPersonal.errors.relation_person && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikPersonal.errors.relation_person}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div> 
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'permanent_address'})}</label>
                                            <div className="input-group">
                                                <textarea rows={4} {...formikPersonal.getFieldProps('permenent_address')} className="form-control" placeholder="Permanent Address" />
                                            </div>
                                            {formikPersonal.touched.permenent_address && formikPersonal.errors.permenent_address && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikPersonal.errors.permenent_address}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'correspondence_address'})}</label>
                                            <div className="input-group">
                                                <textarea rows={4} {...formikPersonal.getFieldProps('correspondence_address')} className="form-control" placeholder="Correspondence Address" />
                                            </div>
                                            {formikPersonal.touched.correspondence_address && formikPersonal.errors.correspondence_address && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikPersonal.errors.correspondence_address}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>                                
                                    </div>
                                </div>
                                <div className='text-center mb-6'>
                                    <button
                                        type='submit'
                                        
                                        className='btn btn_primary text-primary'
                                        disabled={formikPersonal.isSubmitting}
                                    >
                                        {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'submit'})}
                                            <KTSVG
                                                path='/media/custom/save_white.svg'
                                                className='svg-icon-3 svg-icon-primary ms-2' />
                                        </span>}
                                        {loading && (
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
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingThree">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree" id='openAcc'>
                            {intl.formatMessage({id: 'professional_details'})}
                            </button>
                        </h2>
                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                            <form noValidate onSubmit={formikProfessional.handleSubmit}>
                                <div className="accordion-body">
                                    <div className='row'>
                                    <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'date_of_joining'})}</label>
                                            <div className="input-group mb-3">
                                                <input type="date" max={moment().format("YYYY-MM-DD")} {...formikProfessional.getFieldProps('date_of_joining')} className="form-control" placeholder="date" />
                                            </div>
                                            {formikProfessional.touched.date_of_joining && formikProfessional.errors.date_of_joining && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikProfessional.errors.date_of_joining}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'year_of_experiance'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikProfessional.getFieldProps('years_of_experience')} onChange={(e) => formikProfessional.setFieldValue("years_of_experience", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={2} placeholder=""/>
                                        </div>
                                        {formikProfessional.touched.years_of_experience && formikProfessional.errors.years_of_experience && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikProfessional.errors.years_of_experience}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'last_company_name'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikProfessional.getFieldProps('last_company')} placeholder=""/>
                                        </div>
                                        {formikProfessional.touched.last_company && formikProfessional.errors.last_company && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikProfessional.errors.last_company}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'last_company_phone'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikProfessional.getFieldProps('official_mobile_number')} onChange={(e) => formikProfessional.setFieldValue("official_mobile_number", e.target?.value.replace(/[^0-9]/g, ""))} placeholder=""  maxLength ={15}/>
                                        </div>
                                        {formikProfessional.touched.official_mobile_number && formikProfessional.errors.official_mobile_number && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikProfessional.errors.official_mobile_number}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'last_company_mail'})}</label>
                                        <div className="input-group">
                                            <input type="email" className="form-control" {...formikProfessional.getFieldProps('official_mail')} placeholder=""/>
                                        </div>
                                        {formikProfessional.touched.official_mail && formikProfessional.errors.official_mail && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikProfessional.errors.official_mail}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'city'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikProfessional.getFieldProps('city')} placeholder=""/>
                                        </div>
                                        {formikProfessional.touched.city && formikProfessional.errors.city && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikProfessional.errors.city}</span>
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
                                                <input type="text" min="0" {...formikProfessional.getFieldProps('o_phone_number')} onChange={(e) => formikProfessional.setFieldValue("o_phone_number", e.target?.value.replace(/[^0-9]/g, ""))} className="form-control" placeholder="Enter Phone Number"  maxLength ={15}/>
                                            </div>
                                            {formikProfessional.touched.o_phone_number && formikProfessional.errors.o_phone_number && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikProfessional.errors.o_phone_number}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-6 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'Official Email ID'})}</label>
                                            <div className="input-group mb-3">
                                                <input type="email" {...formikProfessional.getFieldProps('o_email')} className="form-control" placeholder="Enter your email" />
                                            </div>
                                            {formikProfessional.touched.o_email && formikProfessional.errors.o_email && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikProfessional.errors.o_email}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'target_for_fy_rs'})} 
                                        <small>(in Rs.)</small>
                                        </label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikProfessional.getFieldProps('target_for_fy_rs')} onChange={(e) => formikProfessional.setFieldValue("target_for_fy_rs", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikProfessional.touched.target_for_fy_rs && formikProfessional.errors.target_for_fy_rs && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikProfessional.errors.target_for_fy_rs}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'duration'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikProfessional.getFieldProps('duration')} onChange={(e) => formikProfessional.setFieldValue("duration", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikProfessional.touched.duration && formikProfessional.errors.duration && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikProfessional.errors.duration}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'company_address'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikProfessional.getFieldProps('local_address')} placeholder=""/>
                                        </div>
                                        {formikProfessional.touched.local_address && formikProfessional.errors.local_address && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikProfessional.errors.local_address}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'target_for_fy_units'})} 
                                        <small>(in Units)</small>
                                        </label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikProfessional.getFieldProps('target_for_fy_units')} onChange={(e) => formikProfessional.setFieldValue("target_for_fy_units", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikProfessional.touched.target_for_fy_units && formikProfessional.errors.target_for_fy_units && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikProfessional.errors.target_for_fy_units}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>                                    
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'monthly_ctc'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikProfessional.getFieldProps('monthly_ctc')} onChange={(e) => formikProfessional.setFieldValue("monthly_ctc", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikProfessional.touched.monthly_ctc && formikProfessional.errors.monthly_ctc && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikProfessional.errors.monthly_ctc}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'monthly_take_home'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikProfessional.getFieldProps('monthly_take_home')} onChange={(e) => formikProfessional.setFieldValue("monthly_take_home", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikProfessional.touched.monthly_take_home && formikProfessional.errors.monthly_take_home && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikProfessional.errors.monthly_take_home}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'incentive'})} %</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikProfessional.getFieldProps('incentive')} onChange={(e) => formikProfessional.setFieldValue("incentive", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikProfessional.touched.incentive && formikProfessional.errors.incentive && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikProfessional.errors.incentive}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>                                         
                                    </div>
                                </div>
                                <div className='text-center mb-6'>
                                    <button
                                        type='submit'
                                        
                                        className='btn btn_primary text-primary'
                                        disabled={formikProfessional.isSubmitting}
                                    >
                                        {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'submit'})}
                                            <KTSVG
                                                path='/media/custom/save_white.svg'
                                                className='svg-icon-3 svg-icon-primary ms-2' />
                                        </span>}
                                        {loading && (
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
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingFour">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                            {intl.formatMessage({id: 'financial_details'})}
                            </button>
                        </h2>
                        <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                            <form noValidate onSubmit={formikFinancial.handleSubmit}>
                                <div className="accordion-body">
                                    <div className='row'>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'base_salary'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikFinancial.getFieldProps('base_salary')} onChange={(e) => formikFinancial.setFieldValue("base_salary", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikFinancial.touched.base_salary && formikFinancial.errors.base_salary && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikFinancial.errors.base_salary}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'pf'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikFinancial.getFieldProps('pf')} onChange={(e) => formikFinancial.setFieldValue("pf", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikFinancial.touched.pf && formikFinancial.errors.pf && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikFinancial.errors.pf}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'hra'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikFinancial.getFieldProps('hra')} onChange={(e) => formikFinancial.setFieldValue("hra", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikFinancial.touched.hra && formikFinancial.errors.hra && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikFinancial.errors.hra}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'total_ctc'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikFinancial.getFieldProps('total_ctc')} onChange={(e) => formikFinancial.setFieldValue("total_ctc", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikFinancial.touched.total_ctc && formikFinancial.errors.total_ctc && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikFinancial.errors.total_ctc}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'mediclaim'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikFinancial.getFieldProps('mediclaim')} onChange={(e) => formikFinancial.setFieldValue("mediclaim", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikFinancial.touched.mediclaim && formikFinancial.errors.mediclaim && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikFinancial.errors.mediclaim}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'conveyance'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikFinancial.getFieldProps('conveyance')} onChange={(e) => formikFinancial.setFieldValue("conveyance", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikFinancial.touched.conveyance && formikFinancial.errors.conveyance && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikFinancial.errors.conveyance}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'misc'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikFinancial.getFieldProps('misc')} onChange={(e) => formikFinancial.setFieldValue("misc", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikFinancial.touched.misc && formikFinancial.errors.misc && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikFinancial.errors.misc}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'name_as_per_bank_record'})}
                                        </label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikFinancial.getFieldProps('bank_record_name')} placeholder=""/>
                                        </div>
                                        {formikFinancial.touched.bank_record_name && formikFinancial.errors.bank_record_name && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikFinancial.errors.bank_record_name}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'bank_name'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikFinancial.getFieldProps('bank_name')} placeholder=""/>
                                        </div>
                                        {formikFinancial.touched.bank_name && formikFinancial.errors.bank_name && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikFinancial.errors.bank_name}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'account_no'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikFinancial.getFieldProps('acc_number')} onChange={(e) => formikFinancial.setFieldValue("acc_number", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={17} placeholder=""/>
                                        </div>
                                        {formikFinancial.touched.acc_number && formikFinancial.errors.acc_number && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikFinancial.errors.acc_number}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'ifsc_code'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikFinancial.getFieldProps('ifsc_code')} maxLength={11} placeholder=""/>
                                        </div>
                                        {formikFinancial.touched.ifsc_code && formikFinancial.errors.ifsc_code && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikFinancial.errors.ifsc_code}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'branch_name'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikFinancial.getFieldProps('branch_name')} placeholder=""/>
                                        </div>
                                        {formikFinancial.touched.branch_name && formikFinancial.errors.branch_name && (
                                            <div className='fv-plugins-message-container'>
                                                <div className='fv-help-block'>
                                                    <span role='alert' className='text-danger'>{formikFinancial.errors.branch_name}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    </div>
                                </div>
                                <div className='text-center mb-6'>
                                    <button
                                        type='submit'
                                        
                                        className='btn btn_primary text-primary'
                                        disabled={formikFinancial.isSubmitting}
                                    >
                                        {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'submit'})}
                                            <KTSVG
                                                path='/media/custom/save_white.svg'
                                                className='svg-icon-3 svg-icon-primary ms-2' />
                                        </span>}
                                        {loading && (
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
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="headingFive">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                            {intl.formatMessage({id: 'goal_details'})}
                            </button>
                        </h2>
                        <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                            <form noValidate onSubmit={formikGoal.handleSubmit}>
                                <div className="accordion-body">
                                    <div className='row'>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'annual_target'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikGoal.getFieldProps('annual_target')} onChange={(e) => formikGoal.setFieldValue("annual_target", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikGoal.touched.annual_target && formikGoal.errors.annual_target && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikGoal.errors.annual_target}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'status_changed'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikGoal.getFieldProps('status_changed')} onChange={(e) => formikGoal.setFieldValue("status_changed", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikGoal.touched.status_changed && formikGoal.errors.status_changed && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikGoal.errors.status_changed}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_units_commited'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikGoal.getFieldProps('no_of_units_committed')} onChange={(e) => formikGoal.setFieldValue("no_of_units_committed", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikGoal.touched.no_of_units_committed && formikGoal.errors.no_of_units_committed && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikGoal.errors.no_of_units_committed}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'no_of_sales'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikGoal.getFieldProps('no_of_sales')} onChange={(e) => formikGoal.setFieldValue("no_of_sales", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikGoal.touched.no_of_sales && formikGoal.errors.no_of_sales && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikGoal.errors.no_of_sales}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>                                    
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'goal_calls'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikGoal.getFieldProps('goal_calls')} onChange={(e) => formikGoal.setFieldValue("goal_calls", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikGoal.touched.goal_calls && formikGoal.errors.goal_calls && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikGoal.errors.goal_calls}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>                                    
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'goal_talktime'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikGoal.getFieldProps('goal_talktime')} onChange={(e) => formikGoal.setFieldValue("goal_talktime", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikGoal.touched.goal_talktime && formikGoal.errors.goal_talktime && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikGoal.errors.goal_talktime}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>                                    
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'goal_leads_generated'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikGoal.getFieldProps('goal_leads_generated')} onChange={(e) => formikGoal.setFieldValue("goal_leads_generated", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikGoal.touched.goal_leads_generated && formikGoal.errors.goal_leads_generated && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikGoal.errors.goal_leads_generated}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>                                    
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'goal_leads_converted'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikGoal.getFieldProps('goal_leads_converted')} onChange={(e) => formikGoal.setFieldValue("goal_leads_converted", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikGoal.touched.goal_leads_converted && formikGoal.errors.goal_leads_converted && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikGoal.errors.goal_leads_converted}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>                                    
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'goal_site_vist'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikGoal.getFieldProps('goal_site_visit')} onChange={(e) => formikGoal.setFieldValue("goal_site_visit", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikGoal.touched.goal_site_visit && formikGoal.errors.goal_site_visit && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikGoal.errors.goal_site_visit}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>                                    
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'goal_meetings'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikGoal.getFieldProps('goal_meetings')} onChange={(e) => formikGoal.setFieldValue("goal_meetings", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikGoal.touched.goal_meetings && formikGoal.errors.goal_meetings && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikGoal.errors.goal_meetings}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>                                    
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'goal_bookings'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikGoal.getFieldProps('goal_bookings')} onChange={(e) => formikGoal.setFieldValue("goal_bookings", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikGoal.touched.goal_bookings && formikGoal.errors.goal_bookings && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikGoal.errors.goal_bookings}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>                                    
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'goal_revenue'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikGoal.getFieldProps('goal_revenue')} onChange={(e) => formikGoal.setFieldValue("goal_revenue", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikGoal.touched.goal_revenue && formikGoal.errors.goal_revenue && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikGoal.errors.goal_revenue}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'incentives'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikGoal.getFieldProps('incentives')} onChange={(e) => formikGoal.setFieldValue("incentives", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikGoal.touched.incentives && formikGoal.errors.incentives && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikGoal.errors.incentives}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'discount'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikGoal.getFieldProps('discount')} onChange={(e) => formikGoal.setFieldValue("discount", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikGoal.touched.discount && formikGoal.errors.discount && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikGoal.errors.discount}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                    <div className="col-md-6 col-12 mb-3">
                                        <label htmlFor="basic-url" className="form-label">{intl.formatMessage({id: 'turnover'})}</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control" {...formikGoal.getFieldProps('turnover')} onChange={(e) => formikGoal.setFieldValue("turnover", e.target?.value.replace(/[^0-9]/g, ""))} maxLength={9} placeholder=""/>
                                        </div>
                                        {formikGoal.touched.turnover && formikGoal.errors.turnover && (
                                                <div className='fv-plugins-message-container'>
                                                    <div className='fv-help-block'>
                                                        <span role='alert' className='text-danger'>{formikGoal.errors.turnover}</span>
                                                    </div>
                                                </div>
                                            )}
                                    </div>                                    
                                </div>
                                </div>
                                <div className='text-center mb-6'>
                                    <button
                                        type='submit'
                                        
                                        className='btn btn_primary text-primary'
                                        disabled={formikGoal.isSubmitting}
                                    >
                                        {!loading && <span className='indicator-label'>{intl.formatMessage({id: 'submit'})}
                                            <KTSVG
                                                path='/media/custom/save_white.svg'
                                                className='svg-icon-3 svg-icon-primary ms-2' />
                                        </span>}
                                        {loading && (
                                            <span className='indicator-progress' style={{ display: 'block' }}>
                                                {intl.formatMessage({id: 'please_wait'})}...{' '}
                                                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div> */}
                </div>
            </div>
            <div className='card-footer py-5 text-center' id='kt_usersettings_footer'>
            </div>
        </div></>
    )
}

export {AddUserSettings}