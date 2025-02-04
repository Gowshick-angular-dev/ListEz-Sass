import React, { useState, useEffect } from "react";
import Board, { moveCard } from "@lourenci/react-kanban";
import "@lourenci/react-kanban/dist/styles.css";
import * as Yup from 'yup'
import {useFormik} from 'formik'
import { Offcanvas, Toast } from 'bootstrap';
import { useIntl } from 'react-intl';
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { updateContactStatus, getContacts } from './core/_requests'
import moment from "moment";

  const initialValues = {
    reply: '',  
}

function ControlledBoardContact({boardData, reload}) {

    const intl = useIntl();
    const data = boardData?.output || [];
    const [controlledBoard, setBoard] = useState({columns: []});  
    const [contactData, setContactData] = useState({});
    const [movedDetails, setMovedDetails] = useState({});  
    const [isLoading, setIsLoading] = useState(false);   
    const [expandId, setExpandId] = useState('');   
    const [expandAssignId, setExpandAssignId] = useState('');   
  
    function handleCardMove(_card, source, destination) {
        const updatedBoard = moveCard(controlledBoard, source, destination);
        setBoard(updatedBoard);
        if(source.fromColumnId != destination.toColumnId) {
            document.getElementById("contact_status_pop_kanban")?.click();
        }
        setMovedDetails({
            "source": source,
            "destination": destination,
            "_card": _card,
        })
    }

    const notesFormSchema = Yup.object().shape({
        reply: Yup.string(),
    })

    const formikNotes = useFormik({
        initialValues,
        validationSchema: notesFormSchema,
        onSubmit: async (values, {setStatus, setSubmitting, resetForm}) => {
          try {   
                let body = {
                    "contact_status": movedDetails.destination?.toColumnId,
                    "reply": values.reply
                }
            const updateStatus = await updateContactStatus(movedDetails._card?.id, body);
            if(updateStatus.status == 200) {
                document.getElementById('kjgfuyeurygwerjhq')?.click();
                setMovedDetails({});
                resetForm();
                var toastEl = document.getElementById('contactStatusUpdate');
                const bsToast = new Toast(toastEl);
                bsToast.show();
            }
          } catch (error) {
            console.error(error)
            setStatus('The registration details is incorrect')
            var toastEl = document.getElementById('contactErrToast');
            const bsToast = new Toast(toastEl);
            bsToast.show();
            setSubmitting(false)
            setIsLoading(false)
          }
        },
    })

    const cancelUpdate = () => {
        reload();
    }

    const contactView = async () => {
        const taskResponse = await getContacts()   
        setContactData(taskResponse.output)     
    }
    contactView()

    useEffect(() => {
        setIsLoading(true)
        if(data?.length > 0) {
            const kanbanBoard = data?.reduce((group, product) => {
                const { contact_status_name } = product;
                group[contact_status_name] = group[contact_status_name] ?? [];
                group[contact_status_name].push(product);
                return group;
            }, {}); 
            const kanbanData = [];              
            for (const key in kanbanBoard) {
                if(kanbanBoard[key][0].contact_status) {
                let col = {
                id: kanbanBoard[key][0].contact_status,
                title: key,
                backgroundColor: "#fff",
                cards: kanbanBoard[key]?.map((t) => {
                    let DragTableBody = {
                        id: t.id,
                        assign: t.assign_to_name,
                        title: t.contact_status_name,
                        contact_status: t.contact_status,
                        property: t.property_name,
                        contact: t.first_name+' '+ `${t.last_name == null ? '' : t.last_name}`,
                        mobile: t.mobile,
                        time: t.created_date,
                        source: t.source_name,
                        created_name: t.created_by_name,
                    }
                    return DragTableBody;
                })
                };
                kanbanData.push(col);
            } 
            }

            kanbanData.sort((a, b) => {
                if (a.id < b.id) return -1;
                if (a.id > b.id) return 1;
                return 0;
            });
            const dataToKanban = {
                columns: kanbanData,
            }
            setBoard(dataToKanban)
            setIsLoading(false)
        }
    }, [data]);

    console.log('contactDatacontactDatacontactData', contactData);
  
    return (<>
    <a className="d-none" href="#" data-bs-toggle='modal' id='contact_status_pop_kanban' data-bs-target={'#contact_status_change_kanban'}></a>
        <div className='modal fade' id={'contact_status_change_kanban'} tabIndex={-1} role="dialog" aria-hidden="true" data-bs-keyboard="false" data-bs-backdrop="static">
            <div className='modal-dialog modal-dialog-centered'>
                <div className='modal-content'>
                    <div className='modal-header'>
                        <h3>{intl.formatMessage({id: 'confirmation'})}</h3>
                        <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal' onClick={cancelUpdate}>
                        <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                        </div>
                        <button className='d-none' data-bs-dismiss='modal' id='kjgfuyeurygwerjhq'>close</button>
                    </div>
                    <div className='modal-body py-lg-10 px-lg-10'>
                        <form noValidate onSubmit={formikNotes.handleSubmit}>
                            <textarea
                                className='form-control main_bg border-0 p-2 resize-none min-h-25px br_10'
                                data-kt-autosize='true'
                                {...formikNotes.getFieldProps('reply')} 
                                rows={7}
                                placeholder='Reason'
                            ></textarea>
                            <div className='d-flex align-items-center justify-content-end'>
                                <button className='btn btn-sm btn-secondary mt-3 me-3' data-bs-dismiss='modal' type='button' onClick={cancelUpdate}>
                                    {intl.formatMessage({id: 'no'})}
                                </button>
                                <button disabled={formikNotes.isSubmitting} className='btn btn-sm btn_primary text-primary mt-3' data-bs-dismiss='modal' type='submit'>
                                    {intl.formatMessage({id: 'yes'})}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        {isLoading ? 
        <div className='w-100 h-100'>
            <div className='d-flex justify-content-center flex-column align-items-center h_80vh'>
                <img src={toAbsoluteUrl('/media/logos/logo-1.png')} className="under_construction_img" alt='' />
                <div className="spinner-border taskloader" role="status">                                    
                    <span className="sr-only">{intl.formatMessage({id: 'loading'})}...</span>
                </div>
            </div> 
        </div>:
        <div>
            {/* <p className="d-flex justify-content-end mb-0">
                <small className="text-nowrap required">{intl.formatMessage({id: 'note'})}:</small>
                <small className="d-flex"> <div className="p-2 pt-1"><span className="dot bg-danger"></span></div> <span>- {intl.formatMessage({id: 'High Priority'})},</span></small>
                <small className="d-flex"> <div className="p-2 pt-1"><span className="dot bg-warning"></span></div> <span>- {intl.formatMessage({id: 'Medium Priority'})},</span></small>
                <small className="d-flex"> <div className="p-2 pt-1"><span className="dot bg-primary"></span></div> <span>- {intl.formatMessage({id: 'Low Priority'})}</span></small>
                <small className="d-flex"> <div className="p-2 pt-1"><span className="dot bg_secondary"></span></div> <span>- {intl.formatMessage({id: 'others'})}</span></small>
            </p> */}
            <Board renderCard={(cards, { removeCard, dragging }) => (
                <div className="card kanban_card my-2 br_10 overflow-hidden" dragging={dragging}>
                    <div className={cards.contact_status == 2 ? "px-3 py-2 bg-primary bg-gradient" : cards.contact_status == 3 ? "px-3 py-2 bg-success bg-gradient" : cards.contact_status == 4 ? "px-3 py-2 bg-danger bg-gradient" : cards.contact_status == 5 ? "px-3 py-2 bg-warning bg-gradient" : cards.contact_status == 6 ? "px-3 py-2 bg-info bg-gradient" : "px-3 py-2 bg_secondary bg-gradient"}>                
                        <div className="d-flex justify-content-between w-100">
                            <div className="flex-grow-1 ms-2">
                                <p className="mb-0 fw-bolder">{cards.id} . {cards.title ?? "Others"}</p>
                                <p className="mb-0 fs-9">{moment(cards.time).format('DD-MM-YYYY hh:mm a') == "Invalid date" ? '' : moment(cards.time).format('DD-MM-YYYY hh:mm a')}</p>
                            </div>
                            <div className="flex-grow-1 me-2 text-end">
                                <p className="mb-0 fw-bolder text-end">{cards.contact ?? "--"}</p>
                                <a href={'tel:'+cards.mobile} className="mb-0 fs-9 text-end text-dark">{cards.mobile ?? '--'}</a>
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-3">
                        <div className="row">
                            <div className="col-sm-6 col-6 mb-3" title={cards.property ?? '--'}>
                                <div className="task_content_single">
                                    <div className="d-flex align-items-start single_item">
                                        <img src={toAbsoluteUrl('/media/custom/project.svg')} alt="" className="me-2"/>
                                        <div className="d-flex flex-column">
                                            <small className="text_light mb-0">{intl.formatMessage({id: 'project'})}</small>
                                            <p className="mb-0 fw-500 fs-9">{cards.property ?? '--'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-6 mb-3" title={cards.assign?.split(',').map((data) => data.split('-')[0]).join(', ') ?? '--'}>
                                <div className="task_content_single">
                                    <div className="d-flex align-items-start single_item">
                                        <img src={toAbsoluteUrl('/media/custom/lead/assign_9.svg')} alt="" className="me-2"/>
                                        <div className="d-flex flex-column">
                                            <small className="text_light mb-0">{intl.formatMessage({id: 'assign_to'})}</small>
                                            {expandAssignId == cards.id ? 
                                            <p onClick={() => setExpandAssignId('')} className="mb-0 fw-500 fs-9">{cards.assign ? (cards.assign?.split(',').map((data) => data.split('-')[0]).join(', ')) : '--'}</p> :
                                            <p onClick={() => setExpandAssignId(cards.id)} className="mb-0 fw-500 fs-9">{cards.assign ? (cards.assign?.split(',').map((data) => data.split('-')[0]).join(', '))?.slice(0, 50)+((cards.assign?.split(',').map((data) => data.split('-')[0]).join(', '))?.length > 50 ? '...' : '') : '--'}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-6 mb-3">
                                <div className="task_content_single">
                                    <div className="d-flex align-items-start single_item">
                                        <img src={toAbsoluteUrl('/media/custom/fromdate.svg')} alt="" className="me-2"/>
                                        <div className="d-flex flex-column">
                                            <small className="text_light mb-0">{intl.formatMessage({id: 'source'})}</small>
                                            {cards.id != expandId ? <>
                                            <p className="mb-0 fw-500 fs-9">{cards.source ? cards.source?.slice(0, 100)+(cards.source?.length > 100 ? '...' : '') : '--'}</p>
                                            {cards.source?.length > 100 ? <a onClick={() => setExpandId(cards.id)} className="text-primary cursor-pointer">Read more...</a> : ''}
                                            </> : <>
                                            <p className="mb-0 fw-500 fs-9">{cards.source ?? '--'}</p>
                                            {cards.id == expandId && <a onClick={() => setExpandId('')} className="text-primary cursor-pointer">Read less...</a>}
                                            </>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-6 mb-3">
                                <div className="task_content_single">
                                    <div className="d-flex align-items-start single_item">
                                        <img src={toAbsoluteUrl('/media/custom/fromdate.svg')} alt="" className="me-2"/>
                                        <div className="d-flex flex-column">
                                            <small className="text_light mb-0">{intl.formatMessage({id: 'created_name'})}</small>
                                            {cards.id != expandId ? <>
                                            <p className="mb-0 fw-500 fs-9">{cards.created_name ? cards.created_name?.slice(0, 100)+(cards.created_name?.length > 100 ? '...' : '') : '--'}</p>
                                            {cards.created_name?.length > 100 ? <a onClick={() => setExpandId(cards.id)} className="text-primary cursor-pointer">Read more...</a> : ''}
                                            </> : <>
                                            <p className="mb-0 fw-500 fs-9">{cards.created_name ?? '--'}</p>
                                            {cards.id == expandId && <a onClick={() => setExpandId('')} className="text-primary cursor-pointer">Read less...</a>}
                                            </>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )} 
            renderColumnHeader={(columns) => (
                <div className="d-flex justify-content-between">
                  <span className="mb-3 kanban_column_title fs-2" >{columns.title}</span>
                  <span>{columns.cards?.length}</span>
                </div>
            )}
            onCardDragEnd={handleCardMove} disableColumnDrag>
                {controlledBoard}
            </Board>
        </div>}
      </>);
  }

export {ControlledBoardContact}                                                                   