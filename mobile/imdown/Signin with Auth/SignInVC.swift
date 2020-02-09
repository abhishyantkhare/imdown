//
//  SignInVC.swift
//  imdown
//
//  Created by Vivek Jain on 2/8/20.
//  Copyright © 2020 Developer. All rights reserved.
//

import UIKit
import AuthenticationServices

class SignInVC: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

//        addAppleButton()
        
        // Do any additional setup after loading the view.
    }

    func addAppleButton(){
        var appleLogInButton : ASAuthorizationAppleIDButton = {
            let button = ASAuthorizationAppleIDButton()
            button.addTarget(self, action: #selector(handleLogInWithAppleID), for: .touchUpInside)
            return button
        }()
        

        
        self.view.addSubview(appleLogInButton)
        
        appleLogInButton.translatesAutoresizingMaskIntoConstraints = false

//        locationButton.bottomAnchor.constraint(equalTo: margins.bottomAnchor, constant: 20).isActive = true
//        locationButton.leadingAnchor.constraint(equalTo: margins.leadingAnchor).isActive = true
//        locationButton.trailingAnchor.constraint(equalTo: margins.trailingAnchor).isActive = true
        
        let centerX = NSLayoutConstraint(item: appleLogInButton, attribute: .centerX, relatedBy: .equal, toItem: self.view, attribute: .centerX, multiplier: 1, constant: 0)
        let centerY = NSLayoutConstraint(item: appleLogInButton, attribute: .centerY, relatedBy: .equal, toItem: self.view, attribute: .centerY, multiplier: 1, constant: 0)
        
        let width = NSLayoutConstraint(item: appleLogInButton, attribute: .width, relatedBy: .equal, toItem: self.view, attribute: .width, multiplier: 0.75, constant: 0)
        
        let height = NSLayoutConstraint(item: appleLogInButton, attribute: .height, relatedBy: .equal, toItem: nil, attribute: .notAnAttribute, multiplier: 1, constant: 50)
        
        centerX.isActive = true
        centerY.isActive = true
        width.isActive = true
        height.isActive = true

        self.view.layoutIfNeeded()
    }
    
    
    
    
    @objc func handleLogInWithAppleID() {
        let request = ASAuthorizationAppleIDProvider().createRequest()
        request.requestedScopes = [.fullName, .email]
        
        let controller = ASAuthorizationController(authorizationRequests: [request])
        
        controller.delegate = self
        controller.presentationContextProvider = self
        
        controller.performRequests()
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}

extension SignInVC: ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding {

    
    func authorizationController(controller: ASAuthorizationController, didCompleteWithError error: Error) {
        print(error)
    }
    func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
        switch authorization.credential {
        case let appleIDCredential as ASAuthorizationAppleIDCredential:
            let userIdentifier = appleIDCredential.user
        
            let defaults = UserDefaults.standard
            defaults.set(userIdentifier, forKey: "userIdentifier1")
            
            //Save the UserIdentifier somewhere in your server/database
//            let vc = UserViewController()
//            vc.userID = userIdentifier
//            self.present(UINavigationController(rootViewController: vc), animated: true)
            break
        default:
            break
        }
    }
    
    func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
           return self.view.window!
    }
    
}

//extension SignInVC : ASAuthorizationControllerDelegate, ASAuthorizationControllerPresentationContextProviding {
//    func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
//        
//    }
//    
//    
//    func authorizationController(controller: ASAuthorizationController, didCompleteWithAuthorization authorization: ASAuthorization) {
//        switch authorization.credential {
//        case let appleIDCredential as ASAuthorizationAppleIDCredential:
//            let userIdentifier = appleIDCredential.user
//        
////            let defaults = UserDefaults.standard
////            defaults.set(userIdentifier, forKey: "userIdentifier1")
////
////            //Save the UserIdentifier somewhere in your server/database
////            let vc = UserViewController()
////            vc.userID = userIdentifier
////            self.present(UINavigationController(rootViewController: vc), animated: true)
//            break
//        default:
//            break
//        }
//    }
//    
//}
