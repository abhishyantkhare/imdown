//
//  SimpleSigninVC.swift
//  imdown
//
//  Created by Vivek Jain on 2/8/20.
//  Copyright © 2020 Developer. All rights reserved.
//

import UIKit

protocol SignInDelegate: class {
    func signedIn(username: String)
}

class SimpleSigninVC: UIViewController {

    @IBOutlet weak var usernameField: UITextField!
    
    weak var signInDelegate : SignInDelegate?
    
    override func viewDidLoad() {
        super.viewDidLoad()

        usernameField.delegate = self
        // Do any additional setup after loading the view.
    }
    

}

extension SimpleSigninVC: UITextFieldDelegate {
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        print("username is \(self.usernameField.text ?? "no username")")
        self.signInDelegate?.signedIn(username: textField.text!)
        return true
    }
}
