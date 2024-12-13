"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#E86A33] to-[#1E40AF] bg-clip-text text-transparent">
            Terms of Service
          </DialogTitle>
          <DialogDescription>
            Last updated: December 2024
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] overflow-auto pr-6">
          <div className="space-y-6 text-gray-600">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Introduction</h3>
              <p>Welcome to Insight Jakarta. By accessing our platform, you agree to these terms of service. These terms apply to all users of the platform, including administrators, government officials, and the general public.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Service Description</h3>
              <p>Insight Jakarta is a real-time monitoring and AI-powered citizen engagement platform designed to provide analytical insights about Jakarta. Our services include:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Real-time news and social media monitoring</li>
                <li>AI-powered analytics and insights</li>
                <li>Citizen engagement tools</li>
                <li>Data visualization and reporting</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. User Responsibilities</h3>
              <p>As a user of Insight Jakarta, you agree to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Provide accurate and truthful information</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Use the platform responsibly and in accordance with applicable laws</li>
                <li>Report any security vulnerabilities or misuse of the platform</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Data Privacy</h3>
              <p>We are committed to protecting your privacy and handling your data responsibly. Our data practices include:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Secure storage of user information</li>
                <li>Transparent data collection practices</li>
                <li>Regular security audits and updates</li>
                <li>Compliance with relevant data protection regulations</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Intellectual Property</h3>
              <p>All content, features, and functionality of Insight Jakarta are owned by us and are protected by international copyright, trademark, and other intellectual property laws.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">6. Limitations of Liability</h3>
              <p>While we strive to provide accurate and reliable information, we cannot guarantee the accuracy, completeness, or timeliness of the data and insights provided through our platform.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">7. Changes to Terms</h3>
              <p>We reserve the right to modify these terms at any time. We will notify users of any material changes through the platform or via email.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">8. Contact Information</h3>
              <p>For questions about these terms or our services, please contact us at:</p>
              <p className="mt-2">
                Email: support@insightjakarta.id<br />
                Address: Jakarta, Indonesia
              </p>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button 
            onClick={onClose}
            className="bg-gradient-to-r from-[#E86A33] to-[#1E40AF] text-white hover:opacity-90"
          >
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal;