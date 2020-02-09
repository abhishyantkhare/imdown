//
//  EventPageVC.swift
//  imdown
//
//  Created by Developer on 2/8/20.
//  Copyright © 2020 Developer. All rights reserved.
//

import UIKit
import MapKit


class EventPageVC: UIViewController {

    
    var eventName = ""
    @IBOutlet weak var eventTitle: UILabel!
    @IBOutlet weak var dateLabel: UILabel!
    @IBOutlet weak var mapView: MKMapView!
    @IBOutlet weak var descriptionView: UITextView!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()

        self.eventTitle.text = eventName
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
    @IBAction func downVote(_ sender: Any) {
        /*
         we probably also want a response
         

         - respond_to_event
             - pass in
                 - user_id
                 - event_id
                 - response: response user inputted
                     - True → Down
                     - False → Not down
             - returns
                 - no error
                     - EventResponse obj
                         - event_id
                         - user_id
                         - response
                     - 200
                 - error
                     - 400 Bad request
         
         */
    }
    
    @IBAction func upVote(_ sender: Any) {
        /*
         we probably also want a response
         

         - respond_to_event
             - pass in
                 - user_id
                 - event_id
                 - response: response user inputted
                     - True → Down
                     - False → Not down
             - returns
                 - no error
                     - EventResponse obj
                         - event_id
                         - user_id
                         - response
                     - 200
                 - error
                     - 400 Bad request
         
         */
    }
    
    
    func simplePostRequest(endPoint: String, params: [String: String], completion: @escaping (_ response: Any?, _ error: Error?) -> Void){
        let Url = String(format: endPoint)
        guard let serviceUrl = URL(string: Url) else { return }
        var request = URLRequest(url: serviceUrl)
        request.httpMethod = "POST"
        request.setValue("Application/json", forHTTPHeaderField: "Content-Type")
        guard let httpBody = try? JSONSerialization.data(withJSONObject: params, options: []) else {
            return
        }
        request.httpBody = httpBody

        let session = URLSession.shared
        session.dataTask(with: request) { (data, response, error) in
            if let data = data {
                do {
                    let json = try JSONSerialization.jsonObject(with: data, options: [])
                    completion(json, error)
                } catch {
                    completion(nil, error)
                }
            }
            }.resume()
    }
}
