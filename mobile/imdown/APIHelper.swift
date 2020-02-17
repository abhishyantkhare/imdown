//
//  APIHelper.swift
//  imdown
//
//  Created by Abhishyant Khare on 2/16/20.
//  Copyright © 2020 Developer. All rights reserved.
//

import Foundation

var uniqueAuth = "testUniqueAuth"
var username = "testUsername"

class APIHelper{
    static func simplePostRequest(endPoint: String, params: [String: Any], completion: @escaping (_ response: Any?, _ error: Error?) -> Void){
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
