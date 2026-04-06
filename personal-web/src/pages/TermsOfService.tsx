
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
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
                    <CardTitle className="text-2xl font-bold">Terms of Service</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none dark:prose-invert overflow-y-auto max-h-[70vh] p-6">
                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        By accessing and using this banking application, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this application's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                    </p>

                    <h3>2. Privacy Policy</h3>
                    <p>
                        Our Privacy Policy describes how we handle the information you provide to us when you use our services. You understand that through your use of the services you consent to the collection and use of this information.
                    </p>

                    <h3>3. User Responsibilities</h3>
                    <p>
                        You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                    </p>

                    <h3>4. Service Modifications</h3>
                    <p>
                        We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice. You agree that we shall not be liable to you or to any third party for any modification, suspension or discontinuance of the service.
                    </p>

                    <h3>5. Financial Transactions</h3>
                    <p>
                        You agree to be responsible for all financial transactions executed through your account. We are not liable for any loss or damage arising from your failure to comply with security measures or for any unauthorized transactions resulting from your negligence.
                    </p>

                    <h3>6. Termination</h3>
                    <p>
                        We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>

                    <h3>7. Governing Law</h3>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the company is established, without regard to its conflict of law provisions.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default TermsOfService;
