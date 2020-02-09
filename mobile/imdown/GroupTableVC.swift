//
//  GroupTableVC.swift
//  imdown
//
//  Created by Vivek Jain on 2/8/20.
//  Copyright © 2020 Developer. All rights reserved.
//

import UIKit

class GroupTableVC: UITableViewController {

    var username : String?
    
    
    var groupNames = ["SEP", "Berkeley", "Girlfriend"]
    
    var groupData = [["Rush", "Beers + Die", "Hangout Squad"], ["The Hub", "Sather Gate", "Wheeler Hall"], ["Romantic Dinner", "Trip to Italy", "Wholesome Dinner"]]
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        navigationController?.navigationBar.prefersLargeTitles = true
        
        self.navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Create", style: .done, target: self, action: #selector(addTapped))
        self.navigationItem.leftBarButtonItem = UIBarButtonItem(title: "Logout", style: .done, target: self, action: #selector(logoutTapped))



    }
    
    @objc func logoutTapped(){
        UserDefaults.standard.removeObject(forKey: "username")
        UserDefaults.standard.synchronize()
        
        let vc = storyboard?.instantiateViewController(identifier: "SignInVC") as! SimpleSigninVC
        vc.signInDelegate = self
        self.present(vc, animated: true, completion: nil)
    }
    
    @objc func addTapped(){

        
        
        let ac = UIAlertController(title: "Create Group", message: nil, preferredStyle: .alert)
        
        ac.addTextField()

        let submitAction = UIAlertAction(title: "Create", style: .default) { [unowned ac] _ in
            let newGroup = ac.textFields![0]
            self.groupNames.append(newGroup.text!)
            self.groupData.append([])
            self.tableView.reloadData()
        }

        let dismissAction = UIAlertAction(title: "Cancel", style: .cancel, handler: nil)
        
        ac.addAction(dismissAction)
        ac.addAction(submitAction)
        
        present(ac, animated: true)
    }
    
    
    override func viewDidAppear(_ animated: Bool) {
        if username == nil {
            let vc = storyboard?.instantiateViewController(identifier: "SignInVC") as! SimpleSigninVC
            vc.signInDelegate = self
            self.present(vc, animated: true, completion: nil)
        }

    }
    
    
//    func showLogInIfNecessary(){
//        if !loggedIn {
//            let vc = storyboard?.instantiateViewController(identifier: "SignInVC") as! SignInVC
//            vc.presentationController?.delegate = self
//            self.present(vc, animated: true, completion: nil)
//        }
//    }
    
    // MARK: - Table view data source

    override func numberOfSections(in tableView: UITableView) -> Int {
        // #warning Incomplete implementation, return the number of sections
        return 1
    }

    override func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        // #warning Incomplete implementation, return the number of rows
        return groupNames.count
    }

    
    override func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "GroupCell", for: indexPath)

        let label = cell.viewWithTag(3) as! UILabel
        label.text = self.groupNames[indexPath.row]
        // Configure the cell...

        return cell
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let singleGroup = storyboard?.instantiateViewController(identifier: "SingleGroupTable") as! SingleGroupTableVC
        singleGroup.eventsList = groupData[indexPath.row]
        singleGroup.title = groupNames[indexPath.row]
        self.navigationController?.pushViewController(singleGroup, animated: true)
    }

    /*
    // Override to support conditional editing of the table view.
    override func tableView(_ tableView: UITableView, canEditRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            // Delete the row from the data source
            tableView.deleteRows(at: [indexPath], with: .fade)
        } else if editingStyle == .insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(_ tableView: UITableView, moveRowAt fromIndexPath: IndexPath, to: IndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(_ tableView: UITableView, canMoveRowAt indexPath: IndexPath) -> Bool {
        // Return false if you do not want the item to be re-orderable.
        return true
    }
    */

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}

extension GroupTableVC: SignInDelegate {
    func signedIn(username: String) {
        self.username = username
        UserDefaults.standard.set(username, forKey: "username")
        UserDefaults.standard.synchronize()
        self.presentedViewController?.dismiss(animated: true, completion: nil)
    }
}
