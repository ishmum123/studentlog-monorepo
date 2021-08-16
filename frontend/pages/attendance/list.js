import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {InputText} from "primereact/inputtext";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Toolbar} from 'primereact/toolbar';
import {Toast} from "primereact/toast";
import {getAttendanceAPI, getStudentAPI} from "../../api";
import {showToast, submitTemplate, datePickerTemplate} from "../../modules/shared/utils"

const BASE_URL_STUDENT = getStudentAPI()
const BASE_URL_ATTENDANCE = getAttendanceAPI()

const getAttendanceList = (studentList, selectedStudentList) => {
    const attendanceObject = {};

    studentList.forEach(student => attendanceObject[student.id] = false);
    selectedStudentList.forEach(student => attendanceObject[student.id] = true);

    return Object
        .getOwnPropertyNames(attendanceObject)
        .map(id => ({id, present: attendanceObject[id]}));
};

const AttendanceHome = () => {
    const [studentList, setStudentList] = useState([]);
    const [selectedStudentList, setSelectedStudentList] = useState([]);
    const [date, setDate] = useState(new Date());
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);

    useEffect(async () => {
        await axios.get(BASE_URL_STUDENT)
            .then(res => setStudentList(res.data) || setSelectedStudentList(res.data))
            .catch(error => console.log("Error occured " + error))
    }, []);

    const submitAttendance = () => {
        axios
            .post(BASE_URL_ATTENDANCE + '/save', {
                date: date.toISOString(),
                list: getAttendanceList(studentList, selectedStudentList)
            })
            .then(_ => showToast(toast, 'success', 'successful', 'Attendance Saved'))
            .catch(error => console.log("Error occured " + error));
    };

    const header =
        <div className="table-header">
            <h5 className="p-m-0">Attendance</h5>
            <span className="p-input-icon-left">
          <i className="pi pi-search"/>
          <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..."/>
      </span>
        </div>;

    return (
        <>
            <Toast ref={toast}/>
            <div className="pb-8 pl-24 text-2xl font-bold">Student Attendance List</div>
            <div className="card ml-24 mr-24">
                <Toolbar className="p-mb-4" left={submitTemplate(submitAttendance)}
                         right={datePickerTemplate(setDate, date)}/>
                <DataTable
                    value={studentList}
                    globalFilter={globalFilter}
                    header={header}
                    datakey="id"
                    paginator rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    selection={selectedStudentList}
                    onSelectionChange={({value}) => setSelectedStudentList(value)}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products">
                    <Column selectionMode="multiple" headerStyle={{width: '3rem'}}/>
                    <Column field="name" header="Name" sortable/>
                    <Column field="studentId" header="Student ID" sortable/>
                </DataTable>
            </div>
        </>
    );
};

export default AttendanceHome;