/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var deviceId = null;
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener('resume', onResume, false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        deviceId = device.uuid;
        this.receivedEvent('deviceready');
        RazorpayCheckout.on('payment.success', successCallback)
        RazorpayCheckout.on('payment.cancel', cancelCallback)
    },


    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

var onResume = function(event) {
    // Re-register the payment success and cancel callbacks
         RazorpayCheckout.on('payment.success', successCallback)
         RazorpayCheckout.on('payment.cancel', cancelCallback)
    // Pass on the event to RazorpayCheckout
    RazorpayCheckout.onResume(event);
  };

 
       function GetMessageFromGCM() {
        
            alert("onNotificationOpen");
        
             try {
        
                window.FirebasePlugin.onNotificationOpen(function (data) {
        
                 alert(JSON.stringify(data));
        
                });
        
            } catch (e) {
        
                alert(e);
        
            }
        
        }

app.initialize();