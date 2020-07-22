
//
//  AddEventVC.swift
//  imdown
//
//  Created by Developer on 2/8/20.
//  Copyright © 2020 Developer. All rights reserved.
//

import UIKit

protocol AddEventDelegate: class {
    func eventAddedWith(name: String, location: String, date: Date, description: String)
}

class AddEventVC: UIViewController {

    weak var addEventDelegate: AddEventDelegate?
    
    @IBOutlet weak var eventNameLabel: UITextField!
    @IBOutlet weak var datePicker: UIDatePicker!
    @IBOutlet weak var eventDescription: UITextView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        eventNameLabel.delegate = self
        eventDescription.delegate = self
        // Do any additional setup after loading the view.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */
    @IBAction func eventAdded(_ sender: Any) {
        self.addEventDelegate?.eventAddedWith(name: self.eventNameLabel.text!, location: "N/A", date: datePicker.date, description: eventDescription.text)
        var address = "address"
        var squad_id = 1
        var uniqueAuth = "testUniqueAuth"
        
        APIHelper.simplePostRequest(endPoint: "http://127.0.0.1:5000/create_event", params: ["auth_hash": uniqueAuth, "title": self.eventNameLabel.text!, "description": eventDescription.text!, "start_time": Int(datePicker?.date.timeIntervalSince1970 ?? 0), "end_time": Int(datePicker?.date.timeIntervalSince1970 ?? 0), "address": address, "squad_id": squad_id  ]) { data, err  in
        }
        
    }
    
}



extension AddEventVC : UITextViewDelegate, UITextFieldDelegate {
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        textField.resignFirstResponder()
    }
    
    func textView(_ textView: UITextView, shouldChangeTextIn range: NSRange, replacementText text: String) -> Bool {
        if(text == "\n") {
            textView.resignFirstResponder()
            return false
        }
        return true
    }
}