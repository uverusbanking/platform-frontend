
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-hero flex flex-col items-center p-4">
            <header className="w-full max-w-4xl p-4 safe-top flex items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors p-2 -ml-2 rounded-lg"
                >
                    <ArrowLeft size={20} />
                    <span className="font-medium">Back</span>
                </button>
            </header>

            <Card className="w-full max-w-4xl shadow-xl mt-4">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert overflow-y-auto max-h-[70vh] p-6">
                    <h3>1. Information Collection</h3>
                    <p>
                        We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.
                    </p>

                    <h3>2. Use of Information</h3>
                    <p>
                        We use the information we collect to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support to Users and Drivers, and authenticate users.
                    </p>

                    <h3>3. Information Sharing</h3>
                    <p>
                        We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including with third party service providers, business partners, or for legal reasons.
                    </p>

                    <h3>4. Data Security</h3>
                    <p>
                        We implement appropriate technical and organizational measures to help protect your personal information from unauthorized access, use, disclosure, alteration, or destruction. However, no data transmission or storage system can be guaranteed to be 100% secure.
                    </p>

                    <h3>5. Cookies and Tracking Technologies</h3>
                    <p>
                        We use cookies and similar technologies to collect information about your use of our services and to provide you with a personalized experience. You can control the use of cookies at the individual browser level.
                    </p>

                    <h3>6. Your Rights</h3>
                    <p>
                        You have the right to access, correct, or delete your personal information. You can manage your information in your account settings or by contacting us directly.
                    </p>

                    <h3>7. Changes to this Policy</h3>
                    <p>
                        We may change this Statement from time to time. If we make significant changes in the way we treat your personal information, or to the Statement, we will provide you notice through the Services or by some other means, such as email.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default PrivacyPolicy;
