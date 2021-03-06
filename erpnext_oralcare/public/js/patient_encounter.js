frappe.ui.form.on("Patient Encounter", "patient", function(frm){
	if(frm.doc.patient){
		frappe.call({
			"method": "erpnext.healthcare.doctype.patient.patient.get_patient_detail",
			args: {
				patient: frm.doc.patient
			},
			callback: function (data) {
				frappe.model.set_value(frm.doctype,frm.docname, "patient_name", data.message.patient_name);
				sidebar_data(data, frm)
			}
		});
	}
})

frappe.ui.form.on("Patient Encounter", "onload", function(frm){
	frm.fields_dict.important_points.html('')
	if(frm.doc.patient){
		frappe.call({
			"method": "erpnext.healthcare.doctype.patient.patient.get_patient_detail",
			args: {
				patient: frm.doc.patient
			},
			callback: function (data) {
				frm.fields_dict.important_points.html(form_patient_info_html(data))
			}
		});
	}

})

frappe.ui.form.on("Procedure Prescription", "procedure", function(frm, cdt, cdn) {
	var row = frappe.get_doc(cdt, cdn);
	frappe.call({
		"method": "frappe.client.get_value",
		"args": {
			"doctype": "Clinical Procedure Template",
			"filters": {
				"name": row.procedure
			},
			"fieldname": "rate",
		},
		"callback": function(response) {
			var r = response.message;
			if (r && r.rate) {
				frappe.model.set_value(cdt, cdn, "price", r.rate);
			}
		}
	})
})

frappe.ui.form.on("Patient Encounter", {
	setup: function(frm) {
		frm.dashboard.init_data()
		var dashboard_case_history_1 = {
			items: ['General CaseHistory', 'Conservative Dentistry and Endondontics', 'Oral Medicine and Diagnosis', 'Oral Surgery and Trauma'],
			label: 'Case History'
		}
		var dashboard_case_history_2 = {
			items: ['Periodontology', 'Prosthodontics', 'Pedodontics'],
			label: 'Case History 1'
		}

		var dashboard_treatment_object = {
			items: ['Clinical Procedure', 'Lab Test'],
			label: 'Treatment'
		}
		frm.dashboard.add_transactions(dashboard_treatment_object)
		frm.dashboard.add_transactions(dashboard_case_history_1)
		frm.dashboard.add_transactions(dashboard_case_history_2)
	},
	refresh: function(frm){
		frm.dashboard.links_area.find('.btn-new').each(function(){
			$(this).removeClass('hidden');
		});
		frm.set_query("drug_code", "drug_prescription", function(){
			return {
				filters: {
					item_group: 'Drug'
				}
			}	
		})
	},
	onload_post_render: function(frm){
		frm.dashboard.links_area.find('.btn-new').each(function(){
			$(this).removeClass('hidden');
		})
	}
});


function form_patient_info_html(data){

	var blood_group = data.message.blood_group || ''
	var allergies = data.message.allergies || ''
	var medication = data.message.medication || ''
	var alchohol_current_use = data.message.alcohol_current_use || ''
	var alchohol_past_use = data.message.alcohol_past_use || ''
	var tobaco_current_use = data.message.tobacco_current_use || ''
	var tobaco_past_use = data.message.tobacco_past_use || ''
	var medical_history = data.message.medical_history || ''
	var surgical_history = data.message.surgical_history || ''

	var html_to_show = `
		<b>Blood Group: </b>${blood_group}<br>
		<b>Allergies: </b>${allergies}<br>
		<b>Medication: </b>${medication}<br>
		<b>Alchohol Current Use: </b>${alchohol_current_use} <b>Alcohol Past User: </b>${alchohol_past_use}<br>
		<b>Tobaco Current Use: </b>${tobaco_current_use} <b>Tobaco Past User: </b>${tobaco_past_use}<br>
		<b>Medical History: </b>${medical_history}<br>
		<b>Surgical History: </b>${surgical_history}<br>
		`
	return html_to_show
}

function sidebar_data(data, frm){
	var data = data.message;
	var details = "";
	if(data.email) details += "<br><b>Email :</b> " + data.email;
	if(data.mobile) details += "<br><b>Mobile :</b> " + data.mobile;
	if(data.occupation) details += "<br><b>Occupation :</b> " + data.occupation;
	if(data.blood_group) details += "<br><b>Blood group : </b> " + data.blood_group;
	if(data.allergies) details +=  "<br><br><b>Allergies : </b> "+  data.allergies;
	if(data.medication) details +=  "<br><b>Medication : </b> "+  data.medication;
	if(data.alcohol_current_use) details +=  "<br><br><b>Alcohol use : </b> "+  data.alcohol_current_use;
	if(data.alcohol_past_use) details +=  "<br><b>Alcohol past use : </b> "+  data.alcohol_past_use;
	if(data.tobacco_current_use) details +=  "<br><b>Tobacco use : </b> "+  data.tobacco_current_use;
	if(data.tobacco_past_use) details +=  "<br><b>Tobacco past use : </b> "+  data.tobacco_past_use;
	if(data.medical_history) details +=  "<br><br><b>Medical history : </b> "+  data.medical_history;
	if(data.surgical_history) details +=  "<br><b>Surgical history : </b> "+  data.surgical_history;
	if(data.surrounding_factors) details +=  "<br><br><b>Occupational hazards : </b> "+  data.surrounding_factors;
	if(data.other_risk_factors) details += "<br><b>Other risk factors : </b> " + data.other_risk_factors;
	if(data.patient_details) details += "<br><br><b>More info : </b> " + data.patient_details;

	if(details){
		details = "<div style='padding-left:10px; font-size:13px;' align='center'></br><b class='text-muted'>Patient Details</b>" + details + "</div>";
	}

	var vitals = "";
	if(data.temperature) vitals += "<br><b>Temperature :</b> " + data.temperature;
	if(data.pulse) vitals += "<br><b>Pulse :</b> " + data.pulse;
	if(data.respiratory_rate) vitals += "<br><b>Respiratory Rate :</b> " + data.respiratory_rate;
	if(data.bp) vitals += "<br><b>BP :</b> " + data.bp;
	if(data.bmi) vitals += "<br><b>BMI :</b> " + data.bmi;
	if(data.height) vitals += "<br><b>Height :</b> " + data.height;
	if(data.weight) vitals += "<br><b>Weight :</b> " + data.weight;
	if(data.signs_date) vitals += "<br><b>Date :</b> " + data.signs_date;

	if(vitals){
		vitals = "<div style='padding-left:10px; font-size:13px;' align='center'></br><b class='text-muted'>Vital Signs</b>" + vitals + "<br></div>";
		details = vitals + details;
	}
	if(details) details += "<div align='center'><br><a class='btn btn-default btn-sm edit-details'>Edit Details</a></b> </div>";

	frm.page.sidebar.addClass("col-sm-3");
	frm.page.sidebar.html(details);
}
